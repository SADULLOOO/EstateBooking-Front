import { useTranslation } from "react-i18next";
import type { Transmission } from "@/types/booking";

export function useTransmissionLabel() {
  const { t } = useTranslation("vehicles");
  return (transmission: Exclude<Transmission, "">) => t(`transmission.${transmission}`);
}
