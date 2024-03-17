
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner"



export const metadata: Metadata = {
  title: "myKino",
  description: "An online cinema app",
  icons: {
    icon: "favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <link rel='icon' href='favicon.ico' />
        </head>
        <body className="w-full h-full flex flex-col">
          {children}
          <Footer />
          <Toaster richColors />
        </body>
      </html>
    </Providers>
  );
}
