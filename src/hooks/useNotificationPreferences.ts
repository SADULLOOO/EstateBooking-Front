import { useEffect, useState } from "react";

const STORAGE_KEY = "housingbook_notification_toasts_enabled";

function readInitial(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

export function useNotificationPreferences() {
  const [toastsEnabled, setToastsEnabled] = useState<boolean>(readInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(toastsEnabled));
  }, [toastsEnabled]);

  return { toastsEnabled, setToastsEnabled };
}
