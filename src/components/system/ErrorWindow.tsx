import Link from "next/link";
import type { ReactNode } from "react";
import "@/components/system/errorWindow.css";

interface ErrorWindowProps {
  windowTitle: string;
  code: string;
  heading: string;
  message: string;
  footer?: string;
  actions: ReactNode;
}

export function ErrorWindow({
  windowTitle,
  code,
  heading,
  message,
  footer = "web-os://system",
  actions,
}: ErrorWindowProps) {
  return (
    <div className="system-error-desktop">
      <div className="system-error-window" role="alertdialog" aria-labelledby="system-error-heading">
        <header className="system-error-header">
          <div className="system-error-title">
            <span className="system-error-title-icon" aria-hidden="true" />
            <span>{windowTitle}</span>
          </div>
          <div className="system-error-controls" aria-hidden="true">
            <span className="system-error-control system-error-control-min" />
            <span className="system-error-control system-error-control-max" />
            <span className="system-error-control system-error-control-close" />
          </div>
        </header>

        <div className="system-error-body">
          <p className="system-error-code">{code}</p>
          <h1 id="system-error-heading" className="system-error-heading">
            {heading}
          </h1>
          <p className="system-error-message">{message}</p>
          <div className="system-error-actions">{actions}</div>
        </div>

        <footer className="system-error-footer">{footer}</footer>
      </div>
    </div>
  );
}

interface ErrorActionProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  primary?: boolean;
}

export function ErrorAction({ href, onClick, children, primary }: ErrorActionProps) {
  const className = `system-error-btn${primary ? " system-error-btn-primary" : ""}`;

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
