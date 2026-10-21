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
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  // Set GOOGLE_SITE_VERIFICATION in Vercel to verify Search Console with a meta tag (omitted when unset).
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

// Marks JS as available, and arms the boot intro once per session unless reduced motion is on.
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('fs-booted')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('booting')}catch(e){}})()`;

// One linked graph: the site, the profile page, and the person it is about (a single @id ties them together).
const PERSON_ID = `${SITE_URL}/#person`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: profile.name,
      description: profile.description,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: title,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": PERSON_ID },
      mainEntity: { "@id": PERSON_ID },
      primaryImageOfPage: `${SITE_URL}/opengraph-image`,
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: profile.name,
      givenName: "Farooq",
      familyName: "Shabbir",
      jobTitle: `${profile.role} (${profile.roleTag})`,
      description: profile.description,
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
      nationality: { "@type": "Country", name: "Pakistan" },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "University of Central Punjab" },
        { "@type": "CollegeOrUniversity", name: "National University of Computing and Emerging Sciences" },
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: profile.role,
        occupationLocation: { "@type": "City", name: "Lahore" },
        skills: "DevOps, AWS, Azure, CI/CD, Docker, Python, FastAPI, Next.js, LLM applications",
      },
      knowsAbout: ["DevOps", "AWS", "Azure", "CI/CD", "GitHub Actions", "Docker", "Python", "FastAPI", "Next.js", "Large language models"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
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
