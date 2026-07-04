import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

type Mode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useTranslation(["forms", "validation"]);
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "login") {
        await login({ phone_number: phoneNumber, password });
      } else {
        await register({ phone_number: phoneNumber, password, confirm_password: confirmPassword });
      }
      onClose();
    } catch {
      setError(mode === "login" ? t("validation:invalidCredentials") : t("validation:registrationFailed"));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="auth-modal glass-surface"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-modal__tabs">
              <button
                type="button"
                className={mode === "login" ? "is-active" : ""}
                onClick={() => setMode("login")}
              >
                {t("forms:auth.loginTab")}
              </button>
              <button
                type="button"
                className={mode === "register" ? "is-active" : ""}
                onClick={() => setMode("register")}
              >
                {t("forms:auth.registerTab")}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-modal__form">
              <input
                type="tel"
                placeholder={t("forms:auth.phonePlaceholder")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder={t("forms:auth.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {mode === "register" && (
                <input
                  type="password"
                  placeholder={t("forms:auth.confirmPasswordPlaceholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              {error && <p className="auth-modal__error">{error}</p>}

              <Button type="submit" disabled={isLoading} className={isLoading ? "is-loading" : ""}>
                {mode === "login" ? t("forms:auth.loginSubmit") : t("forms:auth.registerSubmit")}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
