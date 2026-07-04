import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { I18nProvider } from "@/app/providers/I18nProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { WebSocketProvider } from "@/app/providers/WebSocketProvider";
import { NotificationProvider } from "@/app/providers/NotificationProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <AuthProvider>
              <WebSocketProvider>
                <NotificationProvider>{children}</NotificationProvider>
              </WebSocketProvider>
            </AuthProvider>
          </BrowserRouter>
        </MotionConfig>
      </ThemeProvider>
    </I18nProvider>
  );
}
