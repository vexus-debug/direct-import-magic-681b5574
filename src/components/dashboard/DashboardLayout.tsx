import { ReactNode, useState } from "react";
import { useAppearance } from "@/hooks/useAppearance";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { AICopilotPanel } from "./AICopilotPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, LayoutDashboard, ClipboardPlus } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [aiOpen, setAiOpen] = useState(false);
  const { appearance, toggleAppearance } = useAppearance();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className={`dashboard-theme ${appearance === "dark" ? "dark" : ""} flex h-dvh w-full overflow-hidden dashboard-bg`}>
        <DashboardSidebar />
        <div className="flex flex-1 flex-col h-full overflow-hidden">
          <DashboardHeader
            onToggleAI={() => setAiOpen(!aiOpen)}
            aiOpen={aiOpen}
            appearance={appearance}
            onToggleAppearance={toggleAppearance}
          />

          {isMobile ? (
            <>
              <AnimatePresence mode="wait">
                {!aiOpen ? (
                  <motion.main
                    key="dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 scroll-momentum"
                  >
                    <motion.div initial={false} className="mx-auto w-full max-w-[1540px]">
                      {children}
                    </motion.div>
                  </motion.main>
                ) : (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <AICopilotPanel open={true} onClose={() => setAiOpen(false)} inline />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile bottom toggle */}
              <div className="relative flex items-center border-t border-border bg-background shrink-0">
                {/* Floating AI hint — only when AI tab is not active */}
                <AnimatePresence>
                  {!aiOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute right-[25%] -translate-x-1/2 -top-10 pointer-events-none z-10"
                    >
                      <div className="relative flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg shadow-primary/25">
                        <ClipboardPlus className="w-3 h-3" />
                        <span>Try AI</span>
                        {/* Caret */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45 rounded-[1px]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setAiOpen(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    !aiOpen
                      ? "text-primary border-t-2 border-primary -mt-px"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => setAiOpen(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
                    aiOpen
                      ? "text-primary border-t-2 border-primary -mt-px"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  AI Chat
                  {/* Subtle pulse dot */}
                  {!aiOpen && (
                    <span className="absolute top-2 right-[calc(50%-28px)] w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <main className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 lg:px-8 lg:py-7 scroll-momentum">
                <motion.div initial={false} className="mx-auto w-full max-w-[1540px]">
                  {children}
                </motion.div>
              </main>
              <AICopilotPanel open={aiOpen} onClose={() => setAiOpen(false)} />
            </>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
