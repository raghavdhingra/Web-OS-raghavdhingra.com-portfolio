"use client";

import { useEffect } from "react";
import { ErrorAction, ErrorWindow } from "@/components/system/ErrorWindow";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorWindow
      windowTitle="System Error"
      code="500"
      heading="Something went wrong"
      message={
        error?.message ||
        "An unexpected error occurred while running this application."
      }
      footer={error?.digest ? `web-os://error/${error.digest}` : "web-os://500"}
      actions={
        <>
          <ErrorAction onClick={() => reset()} primary>
            Try again
          </ErrorAction>
          <ErrorAction href="/">Return to desktop</ErrorAction>
        </>
      }
    />
  );
}
