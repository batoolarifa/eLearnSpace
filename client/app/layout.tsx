
import type { Metadata } from "next";
import { Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider"
import AuthProvider from "./utils/AuthProvider";
import Custom from "../app/utils/Custom";
import SocketProvider from "./SocketProvider";


const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins"
});


const josefin = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-josefin"
});


export const metadata: Metadata = {
  title: { 
     default: "eLearnSpace",
     template: "%s | eLearnSpace",
  },
  description:
    "Empowering learners with interactive courses, expert guidance, and a seamless online learning experience.",
  keywords: [
    "eLearnSpace",
    "e-learning",
    "online learning",
    "learning management system",
    "LMS",
    "online courses",
    "education",
    "programming",
    "web development",
    "React",
    "Next.js",
    "TypeScript",
    "AI",
    "skill development",
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" suppressHydrationWarning>
      <body
       className={`${poppins.variable} ${josefin.variable} bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}>
        <SocketProvider>
      <Providers>
          <AuthProvider>
          <ThemeProvider attribute='class' defaultTheme="system" enableSystem>
          <Custom> {children}</Custom>
          <Toaster position="top-center"  reverseOrder={false} />
        </ThemeProvider>
        </AuthProvider>
      </Providers>
      </SocketProvider>
      </body>
    </html>
  );
}



