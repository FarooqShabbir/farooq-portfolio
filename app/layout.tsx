import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { MotionProvider } from "@/components/motion";
import { SITE_URL, profile } from "@/content/profile";
import "./globals.css";

const title = `${profile.name} · ${profile.role} (${profile.roleTag})`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${profile.name}` },
  description: profile.description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "Farooq Shabbir",
    "DevOps Engineer",
    "Full Stack DevOps",
    "AI engineer",
    "AWS",
    "Azure",
    "CI/CD",
    "GitHub Actions",
    "FastAPI",
    "Next.js",
    "Freelance DevOps",
    "Lahore",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: profile.name,
    title,
    description: profile.description,
    locale: "en_US",
    firstName: "Farooq",
    lastName: "Shabbir",
  },
  twitter: { card: "summary_large_image", title, description: profile.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#010102",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    jobTitle: `${profile.role} (${profile.roleTag})`,
    url: SITE_URL,
    address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Central Punjab" },
      { "@type": "CollegeOrUniversity", name: "National University of Computing and Emerging Sciences" },
    ],
    knowsAbout: ["DevOps", "AWS", "Azure", "CI/CD", "Docker", "FastAPI", "Next.js", "Large language models"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface-2 focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
