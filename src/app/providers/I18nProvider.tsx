import { type ReactNode, Suspense } from "react";
import "@/i18n";

export function I18nProvider({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
