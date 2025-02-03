import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";

const UserPanel = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span>{user?.fullName ? user?.fullName : "Anonymouse User"}</span>
        <span style={{ fontSize: "10px", color: "#333" }}>
          {user?.emailAddresses
            ? user?.emailAddresses[0].toString()
            : "test@gmail.com"}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          style={{ padding: "0.5rem", borderRadius: "10px" }}
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserPanel;
