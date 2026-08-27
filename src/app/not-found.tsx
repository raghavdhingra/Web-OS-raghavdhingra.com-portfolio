import { ErrorAction, ErrorWindow } from "@/components/system/ErrorWindow";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Page Not Found",
  description: "The page you requested is not available on Portfolio OS.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <ErrorWindow
      windowTitle="Not Found"
      code="404"
      heading="Page not found"
      message="The path you opened is not available on this desktop."
      footer="web-os://404"
      actions={
        <ErrorAction href="/" primary>
          Return to desktop
        </ErrorAction>
      }
    />
  );
}
