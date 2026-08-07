import { Shield, Lock, Database, Cookie, User, Trash2, Mail, RefreshCw, Sparkles, FileText } from "lucide-react";
import PublicPageShell from "@/pages/PublicPageShell";

const SECTIONS = [
  {
    icon: Shield,
    title: "1. Introduction",
    body: "SkillSync is a peer-to-peer skill swapping platform built for college students, creators, and developers to learn by teaching what they know. This Privacy Policy explains what information we collect when you use the SkillSync app, how we use it, and the choices you have. By using SkillSync, you agree to the practices described here.",
  },
  {
    icon: User,
    title: "2. Information We Collect",
    body: "We collect information you provide directly: your name, email address, college, bio, avatar, the skills you offer, and the skills you want to learn. We also collect information you generate while using the app, such as your connection matches, messages, ratings, reviews, achievements, and learning goals. When you participate in voice or video calls, call metadata such as duration and participants is recorded so we can show your call history.",
  },
  {
    icon: Database,
    title: "3. How We Use Your Information",
    body: "We use your profile and skill data to power the matchmaking matrix, recommend compatible swappers, connect you with peers, deliver messaging and call features, and personalize suggestions from Syncy, our AI mentor. Your reviews and ratings help build trust across the community, and your learning goals help us tailor roadmaps and recommendations.",
  },
  {
    icon: Sparkles,
    title: "4. Syncy AI & Automated Assistance",
    body: "Syncy is an AI assistant integrated into SkillSync that can help draft bios, suggest learning roadmaps, and recommend next steps. Prompts you send to Syncy are processed to generate responses and may be stored to improve your experience. Do not share sensitive personal information with Syncy, as AI-generated suggestions are for guidance only.",
  },
  {
    icon: Lock,
    title: "5. How We Share Information",
    body: "We share your public profile (name, college, avatar, skills, headline, and reviews) with other SkillSync users so you can be discovered for swaps. We do not sell your personal information. We only share data with service providers that help us operate, such as Firebase for authentication and data storage, WebRTC infrastructure for calls, and the AI provider powering Syncy.",
  },
  {
    icon: Database,
    title: "6. Data Storage & Security",
    body: "Your data is stored securely using Firebase. Some state — like your session, connections, messages, and notifications — is cached in your browser's local storage to keep the experience fast and offline-friendly. We use industry-standard encryption in transit and apply access controls to protect your information. No storage system is completely secure, so we encourage strong passwords and responsible sharing.",
  },
  {
    icon: Cookie,
    title: "7. Cookies & Local Storage",
    body: "We use browser local storage to remember your sign-in session, your theme preference, and cached app data. We do not use third-party advertising cookies. You can clear this data at any time from the Settings page using the Wipe Local Storage Data option, or through your browser's settings.",
  },
  {
    icon: RefreshCw,
    title: "8. Data Retention",
    body: "We keep your account and profile data while your account is active. When you request deletion, or if you wipe local data from Settings, cached data is removed immediately. Copies held by our service providers are deleted or anonymized within a reasonable period. Call metadata and AI prompt history are retained only as long as needed to provide the feature.",
  },
  {
    icon: Trash2,
    title: "9. Your Rights & Choices",
    body: "You can review and edit your profile anytime from the Profile tab. You can deactivate connections, clear notifications, and reset all simulated app data from Settings. To request full account deletion or a copy of your data, contact us through the Support Desk. You may also opt out of email sync alerts and public indexing from your Settings page.",
  },
  {
    icon: Shield,
    title: "10. Children's Privacy",
    body: "SkillSync is intended for users who are at least 18 years old or the age of majority in their region. We do not knowingly collect personal information from children. If you believe a minor has provided us data, please contact us and we will delete it promptly.",
  },
  {
    icon: FileText,
    title: "11. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. When we make material changes, we will update the 'Last updated' date below and notify you through the app. Continued use of SkillSync after changes take effect means you accept the updated policy.",
  },
];

export default function PrivacyPolicy() {
  return (
    <PublicPageShell>
      <header className="relative max-w-4xl mx-auto px-6 pt-10 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-brand-card/50 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-brand-primary-hover mb-6">
          <Shield className="w-3.5 h-3.5" /> Trust & Transparency
        </div>
        <h1 className="text-4xl md:text-6xl font-black font-display text-white">
          Privacy <span className="fancy-text">Policy</span>
        </h1>
        <p className="text-slate-400 mt-5 max-w-2xl mx-auto leading-relaxed">
          Your data is yours. Here is exactly what SkillSync collects, why we collect it, and the control you keep over it.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-brand-card/50 px-4 py-2 text-xs text-slate-400">
          <Mail className="w-3.5 h-3.5" /> Last updated: August 2026
        </span>
      </header>

      <div className="relative z-10 mx-auto max-w-4xl px-6 space-y-6">
        {SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <section
              key={section.title}
              className="group relative overflow-hidden rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-7 md:p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)] soft-3d"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
              <div className="relative flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary-hover border border-brand-primary/20 shadow-lg shadow-brand-primary/10">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-white mb-2">{section.title}</h2>
                  <p className="text-sm text-slate-400 leading-relaxed">{section.body}</p>
                </div>
              </div>
              <div className="absolute top-4 right-6 text-5xl font-extrabold font-display text-brand-primary/10 select-none">
                {String(index + 1).padStart(2, "0")}
              </div>
            </section>
          );
        })}
      </div>

      <section className="relative z-10 mx-auto max-w-4xl px-6 mt-10">
        <div className="rounded-[1.6rem] border border-brand-primary/30 bg-gradient-to-r from-brand-primary/15 via-brand-secondary/10 to-brand-accent/10 p-7 md:p-8 text-center soft-3d">
          <h2 className="text-xl font-bold font-display text-white">Questions about your data?</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Our Support Desk is here for you. Reach out anytime and we will help you understand your rights, export your data, or delete your account.
          </p>
        </div>
      </section>
    </PublicPageShell>
  );
}
