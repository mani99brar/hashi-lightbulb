// AppKit exposes a web component <appkit-button /> once createAppKit() is called.
"use client";
import React from "react";

// Add custom element type declaration for TypeScript
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "appkit-button": React.HTMLAttributes<HTMLElement>;
    }
  }
}

export function ConnectButton(props: React.HTMLAttributes<HTMLElement>) {
  return <appkit-button {...props} />;
}