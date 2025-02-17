import styles from "./chat.module.css";
import Markdown from "react-markdown";

type MessageProps = {
  role: "user" | "assistant" | "code";
  content: any;
};

const UserMessage = ({ content }: any) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "end",
        flexDirection: "column",
      }}
    >
      {content &&
        content.map((item, index) => {
          if (item.type === "text") {
            return (
              <p className={styles.userMessage} key={index}>
                {item.text}
              </p>
            );
          } else if (item.type === "image_url") {
            return (
              <img
                style={{
                  width: "60px",
                  height: "60px",
                }}
                key={index}
                src={item.image_url.url}
                alt="user upload"
              />
            );
          }
          return null;
        })}
    </div>
  );
};

const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.codeMessage}>
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  );
};

const Message = ({ role, content }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage content={content} />;
    case "assistant":
      return <AssistantMessage text={content[0].text} />;
    case "code":
      return <CodeMessage text={content[0].text} />;
    default:
      return null;
  }
};

export default Message;
