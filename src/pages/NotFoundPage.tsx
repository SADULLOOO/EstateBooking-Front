import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  return <section>{t("notFound")}</section>;
}
