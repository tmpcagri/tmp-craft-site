import { useEffect, type RefObject } from "react";

// Shared "close on outside click" behavior -- duplicated (identically)
// across account-button.tsx, notification-bell.tsx and
// topluluk-notifications.tsx before this was extracted.
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
