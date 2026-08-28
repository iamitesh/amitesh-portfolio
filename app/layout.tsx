import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amitesh Anand | Frontend Architecture, Design Systems & AI",
  description:
    "Portfolio of Amitesh Anand, a Software Engineer building frontend platforms, enterprise design systems, and applied AI systems.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('aa-theme');var m=localStorage.getItem('aa-motion-reduced');document.documentElement.dataset.theme=(t==='midnight'||t==='editorial'||t==='grid')?t:'grid';document.documentElement.dataset.motion=m===null?(matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':'full'):(m==='true'?'reduced':'full')}catch(e){document.documentElement.dataset.theme='grid';document.documentElement.dataset.motion='full'}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
