import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Bok Oral Assessments Team",
  description: "Designing, delivering, and grading oral assessments in the age of AI. A research summary for Harvard faculty.",
  openGraph: {
    title: "Bok Oral Assessments Team",
    description:
      "Designing, delivering, and grading oral assessments in the age of AI. A research summary for Harvard faculty.",
    images: [{ url: "/oral-new.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bok Oral Assessments Team",
    description:
      "Designing, delivering, and grading oral assessments in the age of AI. A research summary for Harvard faculty.",
    images: ["/oral-new.png"],
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
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('color-mode');
                  if (mode === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={newsreader.variable}>
        {children}
      </body>
    </html>
  );
}
