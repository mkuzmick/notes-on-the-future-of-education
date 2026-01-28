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
  title: "Marlon Kuzmick",
  description: "Notes on the Future of Education",
  openGraph: {
    title: "Puzzles and Questions",
    description:
      "Open questions for rethinking higher education in the age of AI.",
    images: [{ url: "/puzzles-thumbnail-1.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Puzzles and Questions",
    description:
      "Open questions for rethinking higher education in the age of AI.",
    images: ["/puzzles-thumbnail-1.png"],
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
