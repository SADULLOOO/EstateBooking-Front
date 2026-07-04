import { AppProviders } from "@/app/AppProviders";
import { AppRouter } from "@/app/router/AppRouter";

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
