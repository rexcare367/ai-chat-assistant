"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

const RedirectButton: React.FC = () => {
    const { user } = useUser();

    return (
        <div className="w-full flex flex-col gap-6 items-center text-center h-full mt-[150px]">
            <span className="text-[24px] text-custom-gray font-bold">
                Your Email is Verified! 🎉
            </span>
            <span className="text-[16px] text-custom-gray font-normal leading-[24px]">
                Thanks for confirming {user?.emailAddresses[0]?.emailAddress} . Click continue to
                log into your Partner Utopia account.
            </span>
        </div>
        // <div className="flex flex-col items-center justify-center h-screen">
        //   <p className="text-2xl font-bold">
        //     {verified === undefined
        //       ? "Loading"
        //       : verified
        //         ? `Go to Partner Workspaces. Email: ${email}`
        //         : "Something went wrong"}
        //   </p>
        //   {verified && (
        //     <Link href="/company-profile">
        //       Go to Partner Workspaces
        //     </Link>
        //   )}
        // </div>
    );
};

export default RedirectButton;
