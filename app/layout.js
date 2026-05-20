import "./globals.css";
import { ReduxProvider } from "@/store/provider/ReduxProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

export const metadata = {
  title: "Plate - Restaurant Operations",
  description: "Modern restaurant ordering and operations system",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
