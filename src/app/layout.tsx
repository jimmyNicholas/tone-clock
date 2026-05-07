import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tone Clock",
  description: "Listen to the time",
  icons: {
    icon: [
      { url: '/favicon-clock.svg', type: 'image/svg+xml' },
    ],
  },
  verification: {
    google: "r39IYJ_OtEtNR6BLhnZuD19cA7M1aGYlAEsRDkUHOrs",
  },
};

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
        <main>
        {children}
        </main>
      </body>
    </html>
  );
}
