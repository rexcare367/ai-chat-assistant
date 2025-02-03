"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <SignUp />
    </div>
  );
}
