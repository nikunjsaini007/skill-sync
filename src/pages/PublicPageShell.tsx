import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import GalaxyField from "@/components/GalaxyField";

interface PublicPageShellProps {
  children: ReactNode;
}

export default function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <div
      id="info-page"
      className="info-page relative min-h-screen bg-[linear-gradient(180deg,#0A1428_0%,#060B16_45%,#04070F_100%)] text-slate-100 overflow-hidden font-sans"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(56,189,248,0.14),transparent_45%),radial-gradient(circle_at_88%_55%,rgba(250,204,21,0.08),transparent_40%),radial-gradient(circle_at_8%_82%,rgba(56,189,248,0.08),transparent_45%)]" />
        <GalaxyField className="absolute inset-0 h-full w-full" density={0.8} cometInterval={2600} mouseParallax />
      </div>

      <nav className="fixed inset-x-0 top-0 z-50 mx-4 mt-4 rounded-full liquid-glass px-4 py-3 md:mx-6 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/20">
              <Sparkles className="h-5 w-5 animate-pulse text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-primary-hover bg-clip-text text-transparent md:text-2xl">
              SkillSync
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-300 hover:bg-white/5 hover:text-white cursor-pointer"
            >
              Home
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-primary/40 cursor-pointer"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-16">{children}</main>

      <footer className="relative z-10 border-t border-brand-border/40 bg-brand-bg/60 py-12">
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-slate-500 md:flex-row">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold font-display text-slate-300">SkillSync</span>
          </div>

          <p className="text-center text-xs md:text-left">
            &copy; {new Date().getFullYear()} SkillSync. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 md:justify-end">
            <Link to="/privacy-policy" className="transition-colors hover:text-brand-primary-hover">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-brand-primary-hover">
              Terms of Service
            </Link>
            <Link to="/support" className="transition-colors hover:text-brand-primary-hover">
              Support Desk
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
