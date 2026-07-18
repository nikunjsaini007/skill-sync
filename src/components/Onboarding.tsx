import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, RefreshCw, Upload } from "lucide-react";
import { UserProfile } from "../types";
import { POPULAR_SKILLS } from "../data";

interface OnboardingProps {
  email: string;
  onComplete: (profile: UserProfile) => void;
}

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
];

const PRESET_COLLEGES = [
  "Indian Institute of Technology Bombay",
  "Indian Institute of Technology Delhi",
  "Indian Institute of Technology Madras",
  "Indian Institute of Technology Kanpur",
  "Indian Institute of Technology Kharagpur",
  "Indian Institute of Information Technology Hyderabad",
  "Birla Institute of Technology and Science, Pilani",
  "National Institute of Technology Trichy",
  "Vellore Institute of Technology",
  "University of Delhi",
  "Christ University",
  "Symbiosis International University",
  "Jadavpur University",
  "Stanford University",
  "Massachusetts Institute of Technology",
  "Rhode Island School of Design",
  "Indian Institute of Technology Delhi",
  "New York University",
  "University of Texas at Austin",
  "University of California, Berkeley",
  "Aalto University",
  "University of Toronto",
  "University of Michigan",
];

export default function Onboarding({ email, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Stepper state variables
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [customCollege, setCustomCollege] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [experience, setExperience] = useState<"Beginner" | "Intermediate" | "Advanced" | "Expert">("Intermediate");
  const [interests, setInterests] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [bio, setBio] = useState("");
  const [headline, setHeadline] = useState("");


  const [isAiLoading, setIsAiLoading] = useState(false);
  const skillGroups = ["Tech", "Design", "Business", "Creative"] as const;


  const toggleSkillOffered = (skillName: string) => {
    if (skillsOffered.includes(skillName)) {
      setSkillsOffered(skillsOffered.filter(s => s !== skillName));
    } else {
      setSkillsOffered([...skillsOffered, skillName]);
    }
  };

  const toggleSkillWanted = (skillName: string) => {
    if (skillsWanted.includes(skillName)) {
      setSkillsWanted(skillsWanted.filter(s => s !== skillName));
    } else {
      setSkillsWanted([...skillsWanted, skillName]);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };


  const generateAiProfileCopy = async () => {
    if (skillsOffered.length === 0 || skillsWanted.length === 0) {
      setError("Please select at least one skill to offer and one to learn first!");
      return;
    }
    setError("");
    setIsAiLoading(true);
    try {
    
      const bioRes = await fetch("/api/ai/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillsOffered,
          skillsWanted,
          experience,
          interests: interests || "collaborating on full-stack layouts and peer reviews",
          promptType: "bio"
        })
      });
      const bioData = await bioRes.json();
      if (bioData.text) setBio(bioData.text);

      const headlineRes = await fetch("/api/ai/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillsOffered,
          skillsWanted,
          experience,
          promptType: "headline"
        })
      });
      const headlineData = await headlineRes.json();
      if (headlineData.text) {
      
        const choices = headlineData.text.split("\n").map((h: string) => h.replace(/^\d+\.\s*/, "").trim());
        setHeadline(choices[0] || choices[1] || headlineData.text);
      }
    } catch (e) {
      console.error(e);
      setError("AI generation failed. Please enter your bio manually!");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!name.trim()) return setError("Please enter your name.");
      const selectedCollege = college === "Other" ? customCollege : college;
      if (!selectedCollege) return setError("Please specify your college.");
      setStep(2);
    } else if (step === 2) {
      if (skillsOffered.length === 0) return setError("Please select at least one skill to offer!");
      if (skillsWanted.length === 0) return setError("Please select at least one skill you want to learn!");
      setStep(3);
    }
  };

  const handleBack = () => {
    setError("");
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setError("");
    if (!bio.trim()) return setError("Please enter or generate a profile bio!");
    if (!headline.trim()) return setError("Please provide a punchy profile headline.");

    const finalCollege = college === "Other" ? customCollege : college;

    const profile: UserProfile = {
      id: `user-current-${Date.now()}`,
      name,
      email,
      avatar,
      headline,
      bio,
      college: finalCollege,
      skillsOffered,
      skillsWanted,
      experience,
      interests: interests || "Creative programming and design swaps",
      learningGoals: learningGoals || "Building MVPs and scaling P2P connections",
      isOnboarded: true,
      isPremium: false,
      rating: 5.0,
      reviewsCount: 0,
      achievements: ["Early Adopter"],
      location: "San Francisco, CA",
    };

    onComplete(profile);
  };

  return (
    <div id="onboarding-stepper" className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-6 relative font-sans">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[30%] h-[30%] bg-brand-primary/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35%] h-[35%] bg-brand-secondary/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-3xl rounded-[2rem] border border-brand-border/70 bg-gradient-to-br from-brand-card via-brand-card/95 to-brand-sec-bg/80 shadow-[0_25px_90px_rgba(2,6,23,0.38)] relative z-10 overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar Status Info */}
        <div className="w-full md:w-52 bg-brand-sec-bg/50 border-r border-brand-border/40 p-6 flex flex-row md:flex-col justify-between md:justify-start gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary-hover">Setup</h3>
            <h4 className="text-sm font-semibold text-slate-300">Profile Sync</h4>
          </div>

          <div className="flex md:flex-col gap-2 mt-0 md:mt-8">
            {[
              { id: 1, title: "Identity" },
              { id: 2, title: "Skills Matrix" },
              { id: 3, title: "Launch Copy" }
            ].map(s => (
              <div key={s.id} className="flex items-center gap-2 text-xs">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === s.id 
                    ? "bg-brand-primary text-white" 
                    : step > s.id 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-brand-bg text-slate-500 border border-brand-border/60"
                }`}>
                  {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span className={`hidden md:inline ${step === s.id ? "text-slate-200 font-semibold" : "text-slate-500"}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          <div className="hidden md:block mt-auto text-[10px] text-slate-500 font-mono">
            SkillSync Onboarding v1.2
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 p-8 flex flex-col justify-between min-h-[480px]">
          <div>
            <AnimatePresence mode="wait">
              {/* Error Callout */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 mb-6"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Step 1: Basic Identity */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-display text-white">Let's align your identity</h2>
                    <p className="text-xs text-slate-400">Tell us who you are and select an avatar representation.</p>
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-300">Choose Profile Picture</label>
                    <div className="flex flex-wrap gap-3">
                      {AVATAR_OPTIONS.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setAvatar(img)}
                          className={`w-12 h-12 rounded-full overflow-hidden transition-all relative ${
                            avatar === img 
                              ? "ring-2 ring-brand-primary ring-offset-2 ring-offset-brand-card scale-105" 
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt="Avatar option" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <label htmlFor="avatar-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-brand-bg/70 px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-brand-primary hover:text-white">
                        <Upload className="h-3.5 w-3.5" />
                        Upload your own photo
                      </label>
                      <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                      {avatar.startsWith("data:image") && (
                        <span className="text-[10px] font-medium text-emerald-400">Custom photo selected</span>
                      )}
                    </div>
                  </div>

                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="input-name" className="text-xs font-semibold text-slate-300">Full Name</label>
                    <input
                      id="input-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* College Picker */}
                  <div className="space-y-1.5">
                    <label htmlFor="select-college" className="text-xs font-semibold text-slate-300">Your College / Institution</label>
                    <select
                      id="select-college"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-sm text-slate-100 transition-colors"
                    >
                      <option value="">Select College</option>
                      {PRESET_COLLEGES.map((col, i) => (
                        <option key={i} value={col}>{col}</option>
                      ))}
                      <option value="Other">Other (Custom)</option>
                    </select>
                  </div>

                  {/* Custom College field if selected Other */}
                  {college === "Other" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-1.5"
                    >
                      <label htmlFor="input-custom-college" className="text-xs font-semibold text-slate-300">Specify College Name</label>
                      <input
                        id="input-custom-college"
                        type="text"
                        value={customCollege}
                        onChange={e => setCustomCollege(e.target.value)}
                        placeholder="e.g. Harvard University"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-sm text-slate-100 transition-colors"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Skills Configuration */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-display text-white">Declare your skills matrix</h2>
                    <p className="text-xs text-slate-400">Specify what you can teach and what you want to learn.</p>
                  </div>

                  {/* Skills Offered */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-emerald-400">Skills Offered (Skills you can teach)</label>
                    <div className="max-h-56 space-y-3 overflow-y-auto rounded-2xl border border-brand-border/40 bg-brand-bg/50 p-2.5">
                      {skillGroups.map((group) => {
                        const groupSkills = POPULAR_SKILLS.filter(skill => skill.category === group);
                        return (
                          <div key={group} className="space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">{group}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {groupSkills.map((skill, i) => {
                                const isSelected = skillsOffered.includes(skill.name);
                                return (
                                  <button
                                    key={`${group}-${i}`}
                                    onClick={() => toggleSkillOffered(skill.name)}
                                    className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                                      isSelected 
                                        ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-sm"
                                        : "border-brand-border/50 bg-brand-bg text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    {isSelected && <Check className="h-3 w-3 text-emerald-400" />} {skill.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills Wanted */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-purple-400">Skills Wanted (Skills you want to learn)</label>
                    <div className="max-h-56 space-y-3 overflow-y-auto rounded-2xl border border-brand-border/40 bg-brand-bg/50 p-2.5">
                      {skillGroups.map((group) => {
                        const groupSkills = POPULAR_SKILLS.filter(skill => skill.category === group);
                        return (
                          <div key={group} className="space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">{group}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {groupSkills.map((skill, i) => {
                                const isSelected = skillsWanted.includes(skill.name);
                                return (
                                  <button
                                    key={`${group}-${i}`}
                                    onClick={() => toggleSkillWanted(skill.name)}
                                    className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                                      isSelected 
                                        ? "border-purple-500/40 bg-purple-500/20 text-purple-300 shadow-sm"
                                        : "border-brand-border/50 bg-brand-bg text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    {isSelected && <Check className="h-3 w-3 text-purple-400" />} {skill.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Your Average Experience Level</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setExperience(level as any)}
                          className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                            experience === level
                              ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
                              : "bg-brand-bg text-slate-400 border-brand-border/60 hover:text-slate-200"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Launch Copy (Bio & Headline) */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h2 className="text-2xl font-bold font-display text-white">Draft profile copies</h2>
                      <p className="text-xs text-slate-400">Describe yourself or let Syncy draft it for you.</p>
                    </div>
                    
                    {/* Gemini AI helper button */}
                    <button
                      type="button"
                      onClick={generateAiProfileCopy}
                      disabled={isAiLoading}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-md hover:shadow-lg hover:shadow-brand-primary/25 disabled:opacity-50 flex items-center gap-1.5 group transform active:scale-95 transition-all cursor-pointer"
                    >
                      {isAiLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300 group-hover:scale-110 transition-transform" />
                      )}
                      {isAiLoading ? "Syncy is writing..." : "Draft with Syncy AI"}
                    </button>
                  </div>

                  {/* Headline */}
                  <div className="space-y-1.5">
                    <label htmlFor="input-headline" className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>One-liner Profile Headline</span>
                      <span className="text-[10px] text-slate-500">Max 80 chars</span>
                    </label>
                    <input
                      id="input-headline"
                      type="text"
                      maxLength={80}
                      value={headline}
                      onChange={e => setHeadline(e.target.value)}
                      placeholder="e.g. React Front-End dev looking for Video editing exchange"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label htmlFor="textarea-bio" className="text-xs font-semibold text-slate-300">A short bio describing your swap interest</label>
                    <textarea
                      id="textarea-bio"
                      rows={4}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Describe what projects you want to build, what you offer to explain, and when you are free..."
                      className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 transition-colors resize-none"
                    />
                  </div>

                  {/* Optional fields: Interests & Goals */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="input-interests" className="text-[11px] font-semibold text-slate-400">Interests / Passion</label>
                      <input
                        id="input-interests"
                        type="text"
                        value={interests}
                        onChange={e => setInterests(e.target.value)}
                        placeholder="e.g. Hackathons, Web3"
                        className="w-full px-3 py-2 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-xs text-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="input-goals" className="text-[11px] font-semibold text-slate-400">Primary Swap Goal</label>
                      <input
                        id="input-goals"
                        type="text"
                        value={learningGoals}
                        onChange={e => setLearningGoals(e.target.value)}
                        placeholder="e.g. Build an MVP"
                        className="w-full px-3 py-2 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none text-xs text-slate-200"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-brand-border/30">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                id="btn-onboarding-next"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center gap-1.5 shadow-md shadow-brand-primary/10 transition-all cursor-pointer"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-onboarding-complete"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
              >
                Complete Onboarding <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
