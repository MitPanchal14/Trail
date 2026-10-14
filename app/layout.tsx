import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Work Trail — Today",
  description: "A small next action. A place to return to.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
