import { Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Custom Google Form Redesigner",
  description: "Transform standard Google Forms into beautiful, on-brand experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
