import { AlertCircle, Sparkles, X } from "lucide-react";
import React from "react";

interface AuthModalProps {
  authMode: "login" | "signup" | null;
  authName: string;
  onAuthNameChange: (value: string) => void;
  authEmail: string;
  onAuthEmailChange: (value: string) => void;
  authPassword: string;
  onAuthPasswordChange: (value: string) => void;
  authError: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onSwitchMode: () => void;
}

export default function AuthModal({
  authMode,
  authName,
  onAuthNameChange,
  authEmail,
  onAuthEmailChange,
  authPassword,
  onAuthPasswordChange,
  authError,
  onClose,
  onSubmit,
  onSwitchMode,
}: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/85 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-brand-border/70 bg-gradient-to-br from-brand-card via-brand-card/95 to-brand-sec-bg/80 shadow-[0_25px_80px_rgba(2,6,23,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.16),transparent_45%)]" />
        <button
          id="btn-close-auth"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-brand-border/50 bg-brand-bg/60 p-2 text-slate-500 transition-colors hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative flex flex-col lg:flex-row">
          <div className="w-full border-b border-brand-border/50 bg-brand-bg/30 p-8 lg:w-[42%] lg:border-b-0 lg:border-r lg:p-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              {authMode === "login" ? "Welcome back to SkillSync" : "Build your SkillSync profile"}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {authMode === "login"
                ? "Rejoin your learning circle and keep growing together."
                : "Create a profile that reflects your skills and interests."}
            </p>
          </div>

          <div className="w-full p-8 lg:w-[58%] lg:p-10">
            {authError && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div className="space-y-1">
                  <label htmlFor="auth-name" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    value={authName}
                    onChange={e => onAuthNameChange(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-2xl border border-brand-border bg-brand-bg/70 px-4 py-2.5 text-sm text-slate-100 transition-colors placeholder:text-slate-600 focus:border-brand-primary focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="auth-email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  value={authEmail}
                  onChange={e => onAuthEmailChange(e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full rounded-2xl border border-brand-border bg-brand-bg/70 px-4 py-2.5 text-sm text-slate-100 transition-colors placeholder:text-slate-600 focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="auth-pass" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                <input
                  id="auth-pass"
                  type="password"
                  value={authPassword}
                  onChange={e => onAuthPasswordChange(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full rounded-2xl border border-brand-border bg-brand-bg/70 px-4 py-2.5 text-sm text-slate-100 transition-colors placeholder:text-slate-600 focus:border-brand-primary focus:outline-none"
                />
              </div>

              <button
                id="btn-auth-submit"
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary py-3 text-sm font-bold text-white shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.01] hover:shadow-brand-primary/35 cursor-pointer"
              >
                {authMode === "login" ? "Log In" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={onSwitchMode}
                className="font-semibold text-brand-primary hover:underline cursor-pointer"
              >
                {authMode === "login" ? "Sign Up Free" : "Log In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
