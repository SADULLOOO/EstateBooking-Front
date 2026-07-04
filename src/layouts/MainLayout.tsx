import { Outlet } from "react-router-dom";
import { Navbar } from "@/layouts/Navbar";
import { Footer } from "@/layouts/Footer";
import { NotificationToastContainer } from "@/components/notifications/NotificationToastContainer";
import { AIConsultantWidget } from "@/components/ai/AIConsultantWidget";

export function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-layout__content">
        <Outlet />
      </main>
      <Footer />
      <NotificationToastContainer />
      <AIConsultantWidget />
    </div>
  );
}
