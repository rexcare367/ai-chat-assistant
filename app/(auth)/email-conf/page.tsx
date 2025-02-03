"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

interface EmailLinkConfParams {
    result: any;
    redirectUrl: string;
}

function EmailConfirmationContent() {
    const searchParams = useSearchParams();
    const [userEmail, setUserEmail] = useState<string>("");
    const { signUp, isLoaded, setActive } = useSignUp();
    const [countdown, setCountdown] = useState<number>(60);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const email = searchParams.get("email");
        if (email) {
            setUserEmail(email);
        }
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);
        setCountdown(60);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsLoading(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleResendEmail = async () => {
        if (!isLoaded) return;

        setIsLoading(true);
        setCountdown(60);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsLoading(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        try {
            const redirectUrl = `${window.location.origin}/success-register`;
            const { createdSessionId } = await emailLinkConf({
                result: signUp,
                redirectUrl,
            });

            const redirectUrlMain = `${window.location.origin}/company-profile`;

            if (createdSessionId) {
                await setActive({
                    session: createdSessionId,
                    redirectUrl: redirectUrlMain,
                });
            }
        } catch (err) {
            console.log("Error resending email:", err);
            clearInterval(timer);
            setIsLoading(false);
            setCountdown(0);
        }
    };

    const emailLinkConf = async ({
        result,
        redirectUrl,
    }: EmailLinkConfParams): Promise<{ createdSessionId: string | null }> => {
        try {
            const { startEmailLinkFlow, cancelEmailLinkFlow } = result.createEmailLinkFlow();

            cancelEmailLinkFlow();

            const su = await startEmailLinkFlow({
                redirectUrl: redirectUrl,
            });

            const verification = su.verifications.emailAddress;

            if (verification.status === "verified" && su.status === "complete") {
                cancelEmailLinkFlow();
                return { createdSessionId: su.createdSessionId };
            }
            return { createdSessionId: null };
        } catch (error) {
            console.error("Email verification error:", error);
            throw new Error("Failed to verify email address");
        }
    };

    // useEffect(() => {
    //   const checkVerificationStatus = async () => {
    //     if (user && user.emailAddresses.some((email) => email.verification)) {
    //       router.push("/company-profile");
    //     }
    //   };

    //   checkVerificationStatus();
    // }, [router]);

    const isSignUpStarted = signUp?.unverifiedFields?.includes("email_address");
    return (
        <div className="w-full flex flex-col gap-7 items-center text-center h-full mt-[50px]">
            <span className="text-[24px] text-custom-gray font-bold">Please verify your email</span>
            <span className="text-[16px] text-custom-gray font-normal leading-[24px]">
                You&apos;re almost there! We sent an email to {userEmail}
            </span>
            <span className="text-[16px] text-custom-gray font-normal leading-[24px]">
                Just click on the link in that email to complete your signup. If you don&apos;t see
                it, you may need to check your spam folder.
            </span>
            <span className="text-[16px] text-custom-gray font-normal leading-[24px]">
                Still can&apos;t find the email{"?"}
            </span>
            <div className="w-full flex flex-col gap-3">
                <button
                    color="primary"
                    type="button"
                    className="text-small bg-[#0016C8] w-full h-[44px]"
                    onClick={handleResendEmail}
                >
                    Resend Email
                </button>
                {isLoading && isSignUpStarted && (
                    <span className="text-[14px] text-custom-gray font-normal leading-[20px]">
                        Please wait {countdown} seconds to resend the message.
                    </span>
                )}
            </div>
            <span className="text-[16px] text-custom-gray font-normal leading-[24px]">
                Need help? Contact Us
            </span>
        </div>
    );
}

export default function EmailConfirmation() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmailConfirmationContent />
        </Suspense>
    );
}
