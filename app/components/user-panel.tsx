import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import styles from "./chat-history.module.css";

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
        <span style={{ fontSize: "20px" }}>
          {user?.fullName ? user?.fullName : "Anonymouse User"}
        </span>
        <span style={{ fontSize: "14px", color: "#333" }}>
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
          className={styles.button}
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserPanel;
