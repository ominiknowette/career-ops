import type { Metadata, Viewport } from "next";
import { inter, instrumentSerif, instrumentSerifItalic, jetBrainsMono } from "@/lib/fonts";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "career-ops - official web experience",
  description: "The official, local-first web experience for career-ops.",
  // Home-screen / standalone (iOS): let our theme-color flow up to the status bar
  // + Dynamic Island; safe-area insets handle the layout.
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "career-ops" },
};

export const viewport: Viewport = {
  // viewport-fit=cover lets env(safe-area-inset-*) become non-zero so the header can
  // sit flush under the notch / Dynamic Island.
  viewportFit: "cover",
  themeColor: "#faf7f2",
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('career-ops:theme');if(t==='dark')document.documentElement.classList.add('dark');var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');document.head.appendChild(m);}m.setAttribute('content','#faf7f2');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${jetBrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
