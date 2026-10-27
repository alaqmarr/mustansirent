import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/settings";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.companyName} — Industrial Valves, Water Meters & Steam Engineering (${settings.city})`,
    description: settings.aboutShort,
    icons: {
      icon: "/images/logo.png",
      apple: "/images/logo.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-screen w-full flex flex-col antialiased selection:bg-[#C87D20] selection:text-white">
        <Providers>
          <Navbar settings={settings} />
          <main className="flex-1 w-full">{children}</main>
          <Footer settings={settings} />
        </Providers>
      </body>
    </html>
  );
}
