import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";

import Header from "@/components/global/header/Header";
import Footer from "@/components/global/footer/Footer";
import LandContents from "@/components/animations/LandContents";
import { auth } from "@/auth";

const interSans = Funnel_Display({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cuispiria - Recipe Search & Meal Planner",
  description:
    "Cuispiria, an app for finding recipes and organizing your weekly meals.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${interSans.className} antialiased`}>
        <LandContents header={<Header session={session} />} footer={<Footer />}>
          {children}
        </LandContents>
      </body>
    </html>
  );
}
