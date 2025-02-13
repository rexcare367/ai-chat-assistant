import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import styles from "./chat-history.module.css";
import Link from "next/link";

const UserPanel = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {isLoaded ? (
        <React.Fragment>
          {user && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "20px" }}>{user.fullName}</span>
              <span style={{ fontSize: "14px", color: "#333" }}>
                {user.emailAddresses[0].toString()}
              </span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {user ? (
              <button
                className={styles.button}
                onClick={() => signOut({ redirectUrl: "/sign-in" })}
              >
                Sign Out
              </button>
            ) : (
              <Link href="/sign-in" className={styles.button}>
                Sign In
              </Link>
            )}
          </div>
        </React.Fragment>
      ) : (
        "Loading"
      )}
    </div>
  );
};

export default UserPanel;
