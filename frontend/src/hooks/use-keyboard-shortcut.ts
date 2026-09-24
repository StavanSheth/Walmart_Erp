"use client";

import * as React from "react";

interface ShortcutOptions {
  key: string;
  ctrlOrMeta?: boolean;
  shift?: boolean;
  alt?: boolean;
  enabled?: boolean;
}

export function useKeyboardShortcut(
  options: ShortcutOptions,
  callback: (event: KeyboardEvent) => void
) {
  const { key, ctrlOrMeta = false, shift = false, alt = false, enabled = true } = options;

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();
      const isCtrlOrMetaMatch = !ctrlOrMeta || event.ctrlKey || event.metaKey;
      const isShiftMatch = !shift || event.shiftKey;
      const isAltMatch = !alt || event.altKey;

      if (isKeyMatch && isCtrlOrMetaMatch && isShiftMatch && isAltMatch) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, ctrlOrMeta, shift, alt, enabled, callback]);
}
