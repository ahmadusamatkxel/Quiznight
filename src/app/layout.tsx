import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { ReservationProvider } from "@/lib/store";
import { LangProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { HostProvider } from "@/lib/host";
import { AssistantProvider } from "@/lib/assistant-context";
import AssistantDrawer from "@/components/AssistantDrawer";
import AssistantLauncher from "@/components/AssistantLauncher";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "QuizNight — Reserve your table",
  description:
    "Prototype: QuizNight onboarding flow — pick a quiz night, bring your team, reserve a table.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="min-h-full antialiased">
        <ThemeProvider>
          <LangProvider>
            <ReservationProvider>
              <HostProvider>
                <AssistantProvider>
                  {children}
                  <AssistantLauncher />
                  <AssistantDrawer />
                </AssistantProvider>
              </HostProvider>
            </ReservationProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
