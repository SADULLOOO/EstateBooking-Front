import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, title, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = useTranslation("admin");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="auth-modal glass-surface confirm-dialog"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p>{title}</p>
            <div className="confirm-dialog__actions">
              <Button variant="glass" onClick={onCancel}>
                {t("confirmDialog.cancel")}
              </Button>
              <Button variant="primary" onClick={onConfirm}>
                {t("confirmDialog.delete")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
