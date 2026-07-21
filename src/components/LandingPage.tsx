import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Code, Palette, Zap, MessageSquare, Award, Sparkles, Star, CheckCircle, Flame, Shield, ArrowUpRight, Check } from "lucide-react";
import { POPULAR_SKILLS } from "../data";
import { Link } from "react-router-dom";

interface LandingPageProps {
  onStartAuth: (mode: "login" | "signup") => void;
  onExploreDemo: () => void;
}

export default function LandingPage({ onStartAuth, onExploreDemo }: LandingPageProps) {
  const [activeCategory, setActiveCategory] = useState<"All" | "Tech" | "Design" | "Business" | "Creative">("All");

  const categories = ["All", "Tech", "Design", "Business", "Creative"];

  const [showAllSkills, setShowAllSkills] = useState(false);

  const filteredSkills = POPULAR_SKILLS.filter(skill =>
    activeCategory === "All" || skill.category === activeCategory
  );

  const visibleSkills = showAllSkills
    ? filteredSkills
    : filteredSkills.slice(0, 12);
    

  return (
    <div id="landing-container" className="relative min-h-screen bg-brand-bg text-slate-100 overflow-hidden font-sans">


      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-1 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full ambient-glow-2 blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full ambient-glow-3 blur-3xl pointer-events-none" />

      <nav id="landing-navbar" className="fixed inset-x-0 top-0 z-50 mx-4 mt-4 rounded-full border border-brand-border/50 bg-brand-bg/70 px-4 py-3 shadow-[0_10px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl md:mx-6 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/20">
              <Sparkles className="h-5 w-5 animate-pulse text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-primary-hover bg-clip-text text-transparent md:text-2xl">
              SkillSync
            </span>
          </div>


          <div className="hidden items-center gap-2 rounded-full border border-brand-border/40 bg-brand-card/40 px-2 py-2 md:flex">
            <a href="#how-it-works" className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-brand-primary/10 hover:text-brand-primary-hover">How it Works</a>
            <a href="#popular-skills" className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-brand-primary/10 hover:text-brand-primary-hover">Skills</a>
            <a href="#features" className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-brand-primary/10 hover:text-brand-primary-hover">Features</a>
            <a href="#testimonials" className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-brand-primary/10 hover:text-brand-primary-hover">Sync Stories</a>


          </div>


          <div className="flex items-center gap-2">
            <button
              id="btn-login-nav"
              onClick={() => onStartAuth("login")}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-300 hover:bg-white/5 hover:text-white"
            >
              Log In
            </button>
            <button
              id="btn-signup-nav"
              onClick={() => onStartAuth("signup")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-primary/40"
            >
              Get Started <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </nav>


      <header className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-36 flex flex-col lg:flex-row items-center gap-13 z-10">


        <div className="flex-1 space-y-8 text-center lg:text-left mt-10">


          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title font-black font-display text-white"
          >
            <span className="hero-line">Learn Skills.</span>
            <span className="hero-line">Teach Skills.</span>
            <span className="hero-line hero-line--accent fancy-text">
              Grow Together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
          >
            Skip the expensive courses and learn by sharing skills with real people. Give what you know, get what you need, and grow together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              id="btn-hero-signup"
              onClick={() => onStartAuth("signup")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-hover hover:to-brand-accent text-white shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all flex items-center justify-center gap-2.5 group transform active:scale-95"
            >
              Start Syncing Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <a href="#popular-skills"><button
              id="btn-hero-demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold glass-panel text-slate-200 hover:text-white hover:bg-white/5 transition-all border border-brand-border flex items-center justify-center gap-2 transform active:scale-95"
            >
              Explore Skills
            </button></a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 border-t border-brand-border/40"
          >
            <div>
              <div className="text-3xl font-bold font-display text-white">120+</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Early SkillSyncers</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-display text-white">480+</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Skill Matches</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-display text-white">88%</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Positive Feedback</div>
            </div>
          </motion.div>
        </div>


        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative w-full max-w-xl lg:max-w-none flex items-center justify-center"
        >

          <div className="absolute top-[-20px] right-4 bg-brand-card/90 glass-panel border border-brand-primary/40 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xl animate-bounce">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span className="text-[11px] font-mono font-medium text-brand-primary-hover flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" /> Syncy AI Online
            </span>
          </div>

          <div className="w-full bg-gradient-to-b from-brand-card to-brand-bg rounded-[2rem] border border-brand-border p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 via-brand-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-500 bg-brand-sec-bg px-2.5 py-1 rounded-md border border-brand-border/30">
                syncy.core
              </span>
            </div>

            <div className="relative flex flex-col items-center justify-center py-4">
              <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-full border border-brand-primary/30 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent shadow-[0_0_70px_rgba(88,101,242,0.25)]">
                <div className="absolute inset-3 rounded-full border border-white/20" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_45%)]" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-bg/80 shadow-inner">
                  <Sparkles className="h-8 w-8 text-yellow-300" />
                </div>
              </div>

              <div className="absolute left-2 top-8 rounded-full border border-brand-border/60 bg-brand-card/90 px-3 py-1 text-[10px] font-semibold text-slate-200 shadow-lg">
                Share a skill
              </div>
              <div className="absolute right-2 top-20 rounded-full border border-brand-border/60 bg-brand-card/90 px-3 py-1 text-[10px] font-semibold text-slate-200 shadow-lg">
                Learn something new
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-brand-border/60 bg-brand-card/90 px-4 py-2 text-[11px] font-semibold text-brand-primary-hover shadow-lg">
                Smartly matched in seconds
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-brand-border/50 bg-brand-sec-bg/70 px-3 py-3 text-center">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">Teach</div>
                <div className="mt-1 text-sm font-semibold text-slate-100">React</div>
              </div>
              <div className="rounded-2xl border border-brand-border/50 bg-brand-sec-bg/70 px-3 py-3 text-center">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">Learn</div>
                <div className="mt-1 text-sm font-semibold text-slate-100">Design</div>
              </div>
              <div className="rounded-2xl border border-brand-border/50 bg-brand-sec-bg/70 px-3 py-3 text-center">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">Grow</div>
                <div className="mt-1 text-sm font-semibold text-slate-100">Together</div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>


      <section id="how-it-works" className="py-24 bg-brand-sec-bg border-y border-brand-border/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,101,242,0.16),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-[0.35em] text-brand-primary-hover uppercase">Sync Pipeline</h2>
            <h3 className="text-3xl md:text-4xl font-bold font-display text-white">How SkillSync Works</h3>
            <p className="text-slate-400">SkillSync makes it simple to find the right people, trade skills, and start learning together in a few easy steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">


            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.35 }}
              className="group relative p-8 rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/80 via-brand-card/60 to-brand-sec-bg/80 shadow-[0_20px_60px_rgba(2,6,23,0.35)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute top-4 right-6 text-5xl font-extrabold font-display text-brand-primary/10 select-none">01</div>
              <div className="relative w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary-hover mb-6 border border-brand-primary/20 shadow-lg shadow-brand-primary/10">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="relative text-xl font-bold text-slate-100 mb-3">Create & Setup Profile</h4>
              <p className="relative text-sm text-slate-400 leading-relaxed">
                Add your current educational background, declare what skills you are confident in, and specify the skills you are eager to master.
              </p>
              <div className="relative mt-6 h-1.5 rounded-full bg-brand-border/50 overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-500 group-hover:w-full" />
              </div>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="group relative p-8 rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/80 via-brand-card/60 to-brand-sec-bg/80 shadow-[0_20px_60px_rgba(2,6,23,0.35)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/12 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute top-4 right-6 text-5xl font-extrabold font-display text-brand-primary/10 select-none">02</div>
              <div className="relative w-14 h-14 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-6 border border-brand-secondary/20 shadow-lg shadow-brand-secondary/10">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="relative text-xl font-bold text-slate-100 mb-3">Smart Match & Discover</h4>
              <p className="relative text-sm text-slate-400 leading-relaxed">
                Our matchmaking matrix calculates mutual compatibility percentages based on skill tracks, experience gaps, and interests.
              </p>
              <div className="relative mt-6 h-1.5 rounded-full bg-brand-border/50 overflow-hidden">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent transition-all duration-500 group-hover:w-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="group relative p-8 rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/80 via-brand-card/60 to-brand-sec-bg/80 shadow-[0_20px_60px_rgba(2,6,23,0.35)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/12 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute top-4 right-6 text-5xl font-extrabold font-display text-brand-primary/10 select-none">03</div>
              <div className="relative w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-6 border border-brand-accent/20 shadow-lg shadow-brand-accent/10">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="relative text-xl font-bold text-slate-100 mb-3">Connect & Exchange</h4>
              <p className="relative text-sm text-slate-400 leading-relaxed">
                Send a secure sync request. Once accepted, chat in real-time, get roadmap recommendations from Syncy, and trade hours of learning.
              </p>
              <div className="relative mt-6 h-1.5 rounded-full bg-brand-border/50 overflow-hidden">
                <div className="h-full w-5/6 rounded-full bg-gradient-to-r from-brand-accent to-brand-primary transition-all duration-500 group-hover:w-full" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      <section id="popular-skills" className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xs font-bold tracking-[0.35em] text-brand-accent uppercase">Skill Directory</h2>
            <h3 className="text-3xl md:text-4xl font-bold font-display text-white">What SkillSyncers Are Trading</h3>
            <p className="text-slate-400 leading-relaxed">Explore the skills people are actively sharing right now. From design and development to growth and media, there’s always something worth swapping.</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${activeCategory === cat
                  ? "border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "border-brand-border/60 bg-brand-card/40 text-slate-400 hover:border-brand-primary/40 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-[1.3rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/80 via-brand-card/60 to-brand-sec-bg/80 p-5 shadow-[0_16px_45px_rgba(2,6,23,0.28)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10 opacity-0 transition-all duration-500 group-hover:opacity-100" />

              <div className="relative flex items-start justify-between">
                <span className="rounded-full border border-brand-border/40 bg-brand-sec-bg/70 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                  {skill.category}
                </span>

                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < skill.popularity
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-700"
                        }`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative mt-4 flex items-end justify-between">
                <h4 className="font-display font-bold text-slate-200 transition-colors duration-300 group-hover:text-brand-primary-hover">
                  {skill.name}
                </h4>

                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand-border/60 bg-brand-sec-bg/80 text-slate-400 transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSkills.length > 12 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAllSkills(!showAllSkills)}
              className="rounded-full border border-brand-border bg-brand-card px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-brand-primary hover:text-white"
            >
              {showAllSkills ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </section>


      <section id="features" className="relative py-24 border-t border-brand-border/40 bg-brand-sec-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,101,242,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_35%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">

          <div className="mx-auto mb-20 max-w-2xl text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.35em] text-brand-secondary">Startup Quality Features</h2>
            <h3 className="text-3xl font-bold font-display text-white md:text-4xl">Built for Real Connection</h3>
            <p className="text-slate-400">Everything is made to feel easy, trusted, and useful from the first interaction.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.3 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-500/10">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="mb-3 text-xl font-bold text-slate-200">Smart Compatibility Matrix</h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  Match people by skill goals, shared interests, and learning style so every connection feels intentional.
                </p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-1 text-xs font-mono text-brand-primary-hover">98% Accuracy Engine</span>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.3, delay: 0.04 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/12 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/10">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="mb-3 text-xl font-bold text-slate-200">Syncy AI Career Mentor</h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  Get thoughtful recommendations for your next skill swap, your bio, and your learning roadmap.
                </p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-1 text-xs font-mono text-brand-secondary">Gemini AI Integrated</span>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/12 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h4 className="mb-3 text-xl font-bold text-slate-200">Modern Messaging</h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  Talk with your match in a simple, fast space built for quick ideas, feedback, and follow-up.
                </p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-1 text-xs font-mono text-emerald-400">P2P Safe Chats</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.3, delay: 0.12 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/12 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/10">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h4 className="mb-3 text-xl font-bold text-slate-200">Easy Onboarding</h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  Set up your profile and start connecting in a few simple steps without feeling overwhelmed.
                </p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-1 text-xs font-mono text-red-400">3-Step Easy Flow</span>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.3, delay: 0.16 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/12 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/10">
                  <Shield className="h-6 w-6" />
                </div>
                <h4 className="mb-3 text-xl font-bold text-slate-200">Trusted Reviews</h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  Build confidence through feedback, recognition, and visible reputation over time.
                </p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-1 text-xs font-mono text-amber-400">Review Framework</span>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/65 to-brand-sec-bg/80 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/12 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10 text-pink-400 shadow-lg shadow-pink-500/10">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="mb-3 text-xl font-bold text-slate-200">Freemium Growth Path</h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  Start free, unlock more value as you grow, and keep the experience flexible for every stage.
                </p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-1 text-xs font-mono text-pink-400">Freemium Swapping</span>
            </motion.div>

          </div>
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto mb-16 max-w-2xl text-center space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.35em] text-brand-primary">SkillSyncer Stories</h2>
          <h3 className="text-3xl font-bold font-display text-white md:text-4xl">Loved by Students from Top Indian Colleges</h3>
          <p className="text-slate-400">These are honest stories from students who used SkillSync to learn faster, share smarter, and build real confidence.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-[1.5rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/70 to-brand-sec-bg/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex gap-0.5 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                “I swapped my Excel help for UI design feedback with a student from BITS Pilani. I got better at presentations and she got a cleaner portfolio. It felt useful, not forced.”
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/20 font-bold text-brand-primary-hover text-xs">
                  AR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Aarav Rao</h4>
                  <p className="text-[10px] text-slate-500">BBA, NIT Trichy</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="group relative overflow-hidden rounded-[1.5rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/70 to-brand-sec-bg/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/12 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex gap-0.5 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                “I was nervous about public speaking. A student from IIIT Hyderabad helped me practice, and I helped her with Canva. We both walked away better than before.”
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary/20 font-bold text-brand-secondary text-xs">
                  MS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Meera Shah</h4>
                  <p className="text-[10px] text-slate-500">Design, IIT Delhi</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="group relative overflow-hidden rounded-[1.5rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/85 via-brand-card/70 to-brand-sec-bg/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/12 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex gap-0.5 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                “I used SkillSync to find someone from Christ University who could explain coding basics while I helped with Instagram content. It was simple, honest, and really helped me stay consistent.”
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/20 font-bold text-brand-accent text-xs">
                  PK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Priya Kulkarni</h4>
                  <p className="text-[10px] text-slate-500">CS, Symbiosis Pune</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-brand-border/80 bg-gradient-to-r from-brand-primary/25 via-brand-secondary/15 to-brand-accent/15 p-10 text-center shadow-[0_30px_80px_rgba(2,6,23,0.35)] md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(88,101,242,0.2),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%,rgba(255,255,255,0.03))]" />
          <div className="relative z-10">
            <h2 className="mb-6 text-3xl font-bold font-display leading-tight tracking-tight text-white md:text-5xl">
              Stop Buying Courses.<br />Start Syncing Skills.
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-sm text-slate-400 md:text-base">
              Join thousands of college students, creators, and developers sharing knowledge, creating portfolios, and growing their networks together.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                id="btn-cta-signup"
                onClick={() => onStartAuth("signup")}
                className="w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-8 py-4 font-bold text-white shadow-[0_18px_40px_rgba(88,101,242,0.25)] transition-all hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(88,101,242,0.35)] sm:w-auto"
              >
                Sign Up Now
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="relative z-10 border-t border-brand-border/40 bg-brand-bg/80 py-12">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-slate-500 md:flex-row">
    
    <div className="flex items-center space-x-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/20">
        <Sparkles className="h-4 w-4 text-white" />
      </div>

      <span className="text-lg font-bold font-display text-slate-300">
        SkillSync
      </span>
    </div>

    <p className="text-center text-xs md:text-left">
      &copy; {new Date().getFullYear()} SkillSync. All rights reserved.
    </p>

    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 md:justify-end">
      <Link
        to="/privacy-policy"
        className="transition-colors hover:text-brand-primary-hover"
      >
        Privacy Policy
      </Link>

      <Link
        to="/terms"
        className="transition-colors hover:text-brand-primary-hover"
      >
        Terms of Service
      </Link>

      <Link
        to="/support"
        className="transition-colors hover:text-brand-primary-hover"
      >
        Support Desk
      </Link>
    </div>

  </div>
</footer>

    </div>
  );
}
