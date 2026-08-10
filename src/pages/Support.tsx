import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LifeBuoy, ChevronDown, Send, Mail, CheckCircle, MessageSquare, Users, Phone, Sparkles, Star, RefreshCw, Shield, User } from "lucide-react";
import PublicPageShell from "@/pages/PublicPageShell";

const FAQS = [
  {
    q: "How do I get started on SkillSync?",
    a: "Create an account with your email, complete the three-step onboarding (identity, skills matrix, and launch copy), and you'll be ready to match. Your profile tells the community what you can teach and what you want to learn.",
  },
  {
    q: "How does skill matching work?",
    a: "Our matchmaking matrix compares the skills you offer and want against other members, factoring in experience levels and shared interests. Compatibility percentages appear on your Discover page so you can pick the most promising swaps.",
  },
  {
    q: "How do I accept a swap connection and start messaging?",
    a: "Send a sync request from Discover or a peer's profile. Once they accept, a chat space unlocks automatically. You'll get a notification, and the conversation lives under your Messages tab.",
  },
  {
    q: "How do voice and video calls work?",
    a: "From an active chat, use the call buttons to start a voice or video call. Calls connect peer-to-peer over WebRTC — no phone numbers needed. Call metadata like duration is shown in your history.",
  },
  {
    q: "What is Syncy AI and is it free?",
    a: "Syncy is your AI mentor. It can draft your bio, build a 4-week learning roadmap, and suggest resume-ready talking points. It's available to every member, with prioritized responses for Premium users.",
  },
  {
    q: "How do I reset my account data?",
    a: "Go to Settings → Database Administration → Wipe Local Storage Data. This clears your cached chats, matches, ratings, and onboarding profile. Your account stays active and you can re-onboard anytime.",
  },
  {
    q: "How do I upgrade to Premium?",
    a: "Open Settings and tap 'Activate Premium For Free' on the Premium Pass card. Premium unlocks more matches and faster Syncy AI help for your learning path.",
  },
  {
    q: "Where can I find the Privacy Policy and Terms?",
    a: "Scroll to the footer of any public page — you'll find links to the Privacy Policy, Terms of Service, and this Support Desk. You can also reach the Support Desk at any time by opening a ticket below.",
  },
];

const TOPICS = ["Account & Login", "Matching & Connections", "Messaging & Calls", "Syncy AI", "Premium & Billing", "Privacy & Data"];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [submitted, setSubmitted] = useState<null | string>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(form.name.trim());
    setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
    setTimeout(() => setSubmitted(null), 4000);
  };

  return (
    <PublicPageShell>
      <header className="relative max-w-4xl mx-auto px-6 pt-10 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-brand-card/50 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-brand-primary-hover mb-6">
          <LifeBuoy className="w-3.5 h-3.5" /> We're Here For You
        </div>
        <h1 className="text-4xl md:text-6xl font-black font-display text-white">
          Support <span className="fancy-text">Desk</span>
        </h1>
        <p className="text-slate-400 mt-5 max-w-2xl mx-auto leading-relaxed">
          Find quick answers in the FAQ below, or open a ticket and our team will get back to you with a real human reply.
        </p>
      </header>

      <div className="relative z-10 mx-auto max-w-4xl px-6 space-y-10">

        <section className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Users, label: "Community Size", value: "100+ SkillSyncers" },
            { icon: MessageSquare, label: "Avg. Response Time", value: "Under 24 hours" },
            { icon: CheckCircle, label: "Ticket Resolution", value: "95% satisfaction" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-[1.4rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-6 text-center shadow-[0_18px_45px_rgba(2,6,23,0.25)] soft-3d"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
                <div className="relative w-11 h-11 mx-auto rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary-hover border border-brand-primary/20 shadow-lg shadow-brand-primary/10 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="relative text-xl font-bold font-display text-white">{stat.value}</div>
                <div className="relative text-[11px] text-slate-400 mt-1">{stat.label}</div>
                <div className="absolute top-3 right-5 text-4xl font-extrabold font-display text-brand-primary/10 select-none">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            );
          })}
        </section>

        <section className="rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-7 md:p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)] soft-3d">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-brand-primary" /> Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400 mb-6">Quick answers to the questions we hear the most.</p>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-colors ${
                    isOpen ? "border-brand-primary/40 bg-brand-primary/5" : "border-brand-border/50 bg-brand-bg/40"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  >
                    <span className={`text-sm font-semibold ${isOpen ? "text-brand-primary-hover" : "text-slate-200"}`}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-primary" : "text-slate-500"}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-7 md:p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)] soft-3d">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 mb-1">
            <Send className="w-5 h-5 text-brand-primary" /> Open a Support Ticket
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Tell us what's going on and we'll get back to you at the email you provide.
          </p>

          {submitted && (
            <div className="mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Thanks {submitted}! Your ticket was sent. We'll reply shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="support-name" className="text-[11px] font-semibold text-slate-400">Your Name</label>
                <input
                  id="support-name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="support-email" className="text-[11px] font-semibold text-slate-400">Email Address</label>
                <input
                  id="support-email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@college.edu"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="support-topic" className="text-[11px] font-semibold text-slate-400">Topic</label>
              <select
                id="support-topic"
                value={form.topic}
                onChange={e => setForm({ ...form, topic: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-sm text-slate-100 transition-colors cursor-pointer"
              >
                {TOPICS.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="support-message" className="text-[11px] font-semibold text-slate-400">Message</label>
              <textarea
                id="support-message"
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Describe the issue or question in a few lines..."
                className="w-full px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-hover hover:to-brand-accent text-white shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2 group transform active:scale-95 cursor-pointer"
            >
              Send Ticket <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </section>

        <section className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "Syncy AI", text: "Need a roadmap, bio draft, or study plan? Ask Syncy inside the app." },
            { icon: Shield, title: "Privacy & Data", text: "Understand how your data is handled in our Privacy Policy." },
            { icon: Star, title: "Premium", text: "Unlock more matches and prioritized AI help from Settings." },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-[1.4rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-6 shadow-[0_18px_45px_rgba(2,6,23,0.25)] soft-3d"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
                <div className="relative w-11 h-11 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent border border-brand-accent/20 shadow-lg shadow-brand-accent/10 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="relative text-sm font-bold text-slate-100 mb-1.5">{card.title}</h3>
                <p className="relative text-xs text-slate-400 leading-relaxed">{card.text}</p>
              </div>
            );
          })}
        </section>
      </div>
    </PublicPageShell>
  );
}
