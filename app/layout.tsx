import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Warnings from "./components/warnings";
import { assistantId } from "./assistant-config";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Chat Assistant",
  description: "AI Chat Assistant",
  icons: {
    icon: "/openai.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`} style={{ height: "100vh" }}>
          {assistantId ? children : <Warnings />}
        </body>
      </html>
    </ClerkProvider>
  );
}
