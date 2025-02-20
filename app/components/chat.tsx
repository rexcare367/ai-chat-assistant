"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ChangeEvent,
  memo,
} from "react";
import { useParams } from "next/navigation";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { PaperclipIcon, ArrowUpIcon, LoaderIcon } from "./icons";
import Message from "./message";

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""),
}: ChatProps) => {
  const { slug } = useParams();
  const a_ssistantId = slug ? slug[0] : "";
  const a_threadId = slug ? slug[1] : "";

  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState<boolean>(false);
  const [isFinisehdResponse, setisFinisehdResponse] = useState<boolean>(false);
  const [lastIndex, setLastIndex] = useState<number>(0);

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // create a new threadID when chat component created
  useEffect(() => {
    loadChat();
  }, []);

  // create a new threadID when chat component created
  useEffect(() => {}, []);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/assistants/${a_ssistantId}/images`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      console.log("error :>> ", error);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      await setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadImage(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments]
  );

  const loadChat = async () => {
    const res = await fetch(`/api/chat-history/chat/${a_ssistantId}`);
    const chats = await res.json();
    let _messages = [];
    chats.forEach((chat) => {
      const attachments = JSON.parse(chat.attachments);
      _messages = [
        ..._messages,
        {
          role: chat.sender,
          content: [
            {
              type: "text",
              text: chat.text,
            },
          ],
        },
        ...attachments.map((attachment) => ({
          type: "image_url",
          image_url: { url: attachment.url },
        })),
      ];
    });
    console.log("_messages :>> ", _messages.length);
    if (_messages.length) setMessages(_messages);
    setLastIndex(_messages.length);
  };

  const storeChat = async (sender: string, text: string, attachments: any) => {
    await fetch(`/api/chat-history/chat/${a_ssistantId}`, {
      method: "POST",
      body: JSON.stringify({
        sender,
        text: text,
        attachments: attachments,
      }),
    });
  };

  const sendMessage = async (content) => {
    setIsWaitingResponse(true);
    const response = await fetch(
      `/api/assistants/${a_ssistantId}/threads/${a_threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
        }),
      }
    );

    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const submitActionResult = async (runId, toolCallOutputs) => {
    const response = await fetch(
      `/api/assistants/${a_ssistantId}/threads/${a_threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = async (e) => {
    if (inputDisabled) return;
    e.preventDefault();
    if (!userInput.trim()) return;
    let content: any = [{ type: "text", text: userInput }];
    if (attachments.length > 0) {
      content = [
        ...content,
        ...attachments.map((attachment) => ({
          type: "image_url",
          image_url: { url: attachment.url },
        })),
      ];
    }

    setInputDisabled(true);
    sendMessage(content);
    setMessages((prevMessages) => [...prevMessages, { role: "user", content }]);
    setUserInput("");
    setAttachments([]);
    scrollToBottom();

    await storeChat("user", userInput, attachments);
    setLastIndex((prevLastIndex) => prevLastIndex + 1);
  };

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    setIsWaitingResponse(false);
    setisFinisehdResponse(false);
    appendMessage("assistant", "");
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  // imageFileDone - show image in chat
  const handleImageFileDone = (image) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall) => {
    console.log("toolCall :>> ", toolCall);
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta, snapshot) => {
    console.log("toolCallDelta :>> ", delta, snapshot);
    if (delta.type != "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = () => {
    setInputDisabled(false);
    setisFinisehdResponse(true);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);

    // image
    stream.on("imageFileDone", handleImageFileDone);

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") {
        handleRunCompleted();
      }
    });
  };

  useEffect(() => {
    if (isFinisehdResponse) {
      let _lastIndex = lastIndex;
      (async () => {
        for (let index = _lastIndex; index < messages.length; index++) {
          await storeChat(
            messages[index].role,
            messages[index].content[0].text,
            []
          );
          _lastIndex += 1;
        }
        setLastIndex(_lastIndex);
      })();
      console.log("lastIndex :>> ", lastIndex);
    }
  }, [isFinisehdResponse]);

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

  const appendToLastMessage = (text) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        content: [{ type: "text", text: lastMessage.content[0].text + text }],
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role, content: [{ type: "text", text }] },
    ]);
  };

  const annotateLastMessage = (annotations) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
      };
      annotations.forEach((annotation) => {
        if (annotation.type === "file_path") {
          updatedLastMessage.content[0].text =
            updatedLastMessage.content[0].text.replaceAll(
              annotation.text,
              `/api/files/${annotation.file_path.file_id}`
            );
        }
      });
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  function PureAttachmentsButton({
    fileInputRef,
    isLoading,
  }: {
    fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
    isLoading: boolean;
  }) {
    return (
      <button
        className="p-2 rounded-full text-black"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        disabled={isLoading}
      >
        <PaperclipIcon />
      </button>
    );
  }

  const AttachmentsButton = memo(PureAttachmentsButton);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.length < 1 ? (
          <div className="flex-1 flex items-center justify-center px-2 py-4 md:p-8">
            <div className="max-w-2xl w-full px-2 py-8 md:p-8 text-center space-y-8 rounded-lg border bg-gradient-to-b from-primary/5 to-primary/10">
              <div className="space-y-4">
                <h1 className="text-md md:text-2xl font-bold">
                  Welcome to AI Assistant
                </h1>
                <p className="text-muted-foreground text-sm md:text-md">
                  Start a new chat to begin your AI-powered conversation.
                </p>
                <p className="text-muted-foreground text-sm md:text-md">
                  Ask me anything - I'm here to help!
                </p>
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center">
                  * Real-time responses
                </div>
                <div className="flex items-center gap-2 justify-center">
                  * Smart suggestions
                </div>
                <div className="flex items-center gap-2 justify-center">
                  * Code assistance
                </div>
                <div className="flex items-center gap-2 justify-center">
                  * 24/7 availability
                </div>
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment>
            {messages.map((msg, index) => (
              <Message key={index} role={msg.role} content={msg.content} />
            ))}
            {isWaitingResponse && (
              <div className="flex flex-row justify-start items-center gap-2">
                <span className="animate-spin">
                  <LoaderIcon size={26} />
                </span>
                <Message role="assistant" content={[{ text: "Thinking..." }]} />
              </div>
            )}
          </React.Fragment>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.previewImg}>
        {attachments.map((attachment, index) => {
          return (
            <img
              className="w-[60px] h-[60px] rounded-md"
              key={index}
              src={attachment.url}
              alt="attt"
            />
          );
        })}
        {uploadQueue &&
          uploadQueue.map((filename, i) => {
            return (
              <div
                className="w-[60px] h-[60px] rounded-md transition-all animate-pulse bg-slate-200"
                key={i}
              >
                {filename}
              </div>
            );
          })}
      </div>
      {a_ssistantId && (
        <div className="flex flex-row gap-2 relative">
          <input
            type="file"
            accept=".png,.jpeg,.jpg"
            style={{
              display: "none",
            }}
            className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            tabIndex={-1}
          />
          <div className="absolute z-10 top-4 left-3">
            <AttachmentsButton fileInputRef={fileInputRef} isLoading={false} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className={`${styles.inputForm} ${styles.clearfix}`}
          >
            <input
              type="text"
              className={`${styles.input} pl-12 py-4`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your question"
            />
            <button
              type="submit"
              className={`${styles.button} absolute right-4 top-3 p-2 bg-black`}
              disabled={inputDisabled}
            >
              <ArrowUpIcon />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
