import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthZustandProvider from "@/providers/AuthZustandProvider";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata:Metadata={
  title: {
    template: '%s | My Next.js App', // '%s' will be replaced by page-specific title
    default: 'Welcome to My Next.js App', // Default title for the root route '/'
  },
  description: 'A starter Next.js application with authentication.',
  // You can add other global meta tags here, e.g.:
  // keywords: ['Next.js', 'Zustand', 'Authentication'],
  // openGraph: {
  //   title: 'My Next.js App',
  //   description: 'A starter Next.js application with authentication.',
  //   url: 'https://yourwebsite.com',
  //   siteName: 'My Next.js App',
  //   images: [
  //     {
  //       url: 'https://yourwebsite.com/og-image.jpg',
  //       width: 800,
  //       height: 600,
  //     },
  //   ],
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthZustandProvider>
          <Header/>
        {children}
        <Footer/>
        </AuthZustandProvider>
      </body>
    </html>
  );
}
