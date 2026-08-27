import type { Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import { site } from "@/data/site";
import { createRootMetadata, structuredDataJsonLd } from "@/lib/seo";
import "../assets/default.css";

export const metadata = createRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.themeColor,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.language}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataJsonLd()),
          }}
        />
        <Providers>{children}</Providers>
        <noscript>
          <main>
            <h1>{site.title}</h1>
            <p>{site.description}</p>
          </main>
        </noscript>
      </body>
    </html>
  );
}
