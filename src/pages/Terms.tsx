import { Scale, User, Ban, Shield, Sparkles, MessageSquare, Phone, Video, Star, Zap, Copyright, Mail, FileText, RefreshCw } from "lucide-react";
import PublicPageShell from "@/pages/PublicPageShell";

const SECTIONS = [
  {
    icon: FileText,
    title: "1. Acceptance of Terms",
    body: "By accessing or using SkillSync, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, please do not use the app. These terms apply to every visitor, member, and contributor of the SkillSync community.",
  },
  {
    icon: User,
    title: "2. Eligibility",
    body: "You must be at least 18 years old (or the age of majority in your region) to create an account. By registering, you confirm that the information you provide is accurate, current, and complete, and that you will keep it up to date.",
  },
  {
    icon: Shield,
    title: "3. Accounts & Registration",
    body: "You are responsible for safeguarding your account credentials and for all activity that happens under your account. Notify us immediately if you suspect unauthorized access. You may not create multiple accounts to bypass restrictions, nor register using another person's identity.",
  },
  {
    icon: Sparkles,
    title: "4. The Skill Swap Promise",
    body: "SkillSync connects you with peers to exchange knowledge. When you accept a connection, you agree to be respectful, show up for scheduled exchanges, and give honest, constructive feedback. Swapping is a two-way commitment: what you offer is as valuable as what you receive.",
  },
  {
    icon: Ban,
    title: "5. Prohibited Conduct",
    body: "You may not: use SkillSync for any unlawful purpose; harass, bully, or impersonate others; share spam, scams, or malicious content; attempt to exploit or harm the platform, its users, or its infrastructure; or use the service to collect data without consent. We reserve the right to suspend or terminate accounts that violate these rules.",
  },
  {
    icon: MessageSquare,
    title: "6. Messaging, Ratings & Reviews",
    body: "Messages are meant for learning exchanges. You grant SkillSync the right to process and store messages to deliver the feature. Ratings and reviews must be honest and based on genuine experience. Fake, retaliatory, or abusive reviews are grounds for removal.",
  },
  {
    icon: Phone,
    title: "7. Voice & Video Calls",
    body: "Voice and video calls are delivered peer-to-peer over WebRTC. SkillSync acts as a facilitator and is not liable for the content of third-party conversations. You are responsible for what you say and share during calls, and you consent to standard call metadata (participants, duration) being recorded.",
  },
  {
    icon: Sparkles,
    title: "8. Syncy AI Assistant",
    body: "Syncy provides AI-generated suggestions for bios, roadmaps, and next steps. AI output may be imperfect or inaccurate. You are responsible for reviewing and confirming anything you post based on AI suggestions before sharing it with others.",
  },
  {
    icon: Star,
    title: "9. Premium Membership",
    body: "Premium unlocks extra matches and prioritized AI support. If offered for a fee, payment terms will be presented before purchase. Premium benefits may change over time, and SkillSync does not guarantee unlimited matches or specific outcomes.",
  },
  {
    icon: Zap,
    title: "10. Intellectual Property",
    body: "The SkillSync name, logo, interface, and content belong to SkillSync and its licensors. Your profile, reviews, and messages belong to you. By posting content, you grant SkillSync a limited license to display and process it solely to operate the service. You may not copy, scrape, or resell SkillSync's design or content.",
  },
  {
    icon: Scale,
    title: "11. Third-Party Services",
    body: "SkillSync relies on third-party providers including Firebase (authentication and storage), WebRTC infrastructure (calls), and an AI provider (Syncy). These providers have their own terms and privacy policies. Your use of those underlying services is subject to their respective terms.",
  },
  {
    icon: Shield,
    title: "12. Disclaimer of Warranties",
    body: "SkillSync is provided 'as is' and 'as available' without warranties of any kind, express or implied, including fitness for a particular purpose. We do not guarantee that matches will lead to successful learning outcomes, or that the service will be uninterrupted or error-free.",
  },
  {
    icon: Scale,
    title: "13. Limitation of Liability",
    body: "To the maximum extent permitted by law, SkillSync shall not be liable for indirect, incidental, special, or consequential damages, including lost profits, data, or learning opportunities, arising from your use of the platform. Our total liability is limited to the amount you paid us in the prior three months, or a nominal amount if you paid nothing.",
  },
  {
    icon: Copyright,
    title: "14. Termination",
    body: "You may delete your account at any time through the Support Desk. We may suspend or terminate accounts that breach these terms, at our discretion. On termination, your access to the platform stops and your data is handled in line with our Privacy Policy.",
  },
  {
    icon: RefreshCw,
    title: "15. Changes to These Terms",
    body: "We may revise these terms from time to time. Material changes will be announced in the app, and the 'Last updated' date below will be refreshed. Continuing to use SkillSync after changes means you accept the revised terms.",
  },
  {
    icon: Scale,
    title: "16. Governing Law & Disputes",
    body: "These terms are governed by the laws of India. Any disputes will be resolved through good-faith negotiation first, then binding arbitration or the courts of New Delhi, India, as applicable. Nothing in these terms limits your rights under applicable consumer protection laws.",
  },
];

export default function Terms() {
  return (
    <PublicPageShell>
      <header className="relative max-w-4xl mx-auto px-6 pt-10 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-brand-card/50 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-brand-primary-hover mb-6">
          <Scale className="w-3.5 h-3.5" /> Fair Play, Clear Rules
        </div>
        <h1 className="text-4xl md:text-6xl font-black font-display text-white">
          Terms of <span className="fancy-text">Service</span>
        </h1>
        <p className="text-slate-400 mt-5 max-w-2xl mx-auto leading-relaxed">
          The agreement that keeps SkillSync a safe, respectful, and genuinely useful place to learn and teach.
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
          <h2 className="text-xl font-bold font-display text-white">Questions about the rules?</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Reach out to the Support Desk and our team will clarify anything that is unclear.
          </p>
        </div>
      </section>
    </PublicPageShell>
  );
}
