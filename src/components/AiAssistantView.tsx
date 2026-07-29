import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, Brain, Compass, BookOpen, FileText, Bot, RefreshCw, Star, Check } from "lucide-react";
import { UserProfile } from "../types";

interface AiAssistantViewProps {
  currentUser: UserProfile;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function AiAssistantView({ currentUser }: AiAssistantViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: `Hey there, I'm **Syncy**! 🚀 Your personal SkillSync AI Career Mentor and Swapping Guide.\n\nI can help you build **personalized learning roadmaps**, draft perfect **resume bullets**, generate **headline hooks**, or analyze your skill matches.\n\nWhat are we mastering today?`
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputText.trim();
    if (!promptToSend) return;


    const userMessage: ChatMessage = { role: "user", text: promptToSend };
    setMessages(prev => [...prev, userMessage]);

    if (!customPrompt) setInputText("");
    setIsLoading(true);

    try {

      const historyPayload = messages
        .slice(-6)
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          history: historyPayload,
          profile: {
            name: currentUser.name,
            college: currentUser.college,
            skillsOffered: currentUser.skillsOffered,
            skillsWanted: currentUser.skillsWanted,
            experience: currentUser.experience,
            interests: currentUser.interests,
            learningGoals: currentUser.learningGoals
          }
        })
      });

      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: "model", text: data.text }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: "model", text: `Sorry, I encountered an error: ${data.error}` }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "model", text: "Oops, I'm having trouble syncing with the AI core. Let's try sending that again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (type: "roadmap" | "resume" | "matches" | "headline") => {
    let prompt = "";
    switch (type) {
      case "roadmap":
        prompt = `Generate a detailed 4-week step-by-step learning roadmap to master: ${currentUser.skillsWanted[0] || "my requested skill"}. Give specific weekly milestones and recommend projects to build during swaps.`;
        break;
      case "resume":
        prompt = `Suggest 3 high-impact resume bullet points reflecting my offered skills: ${currentUser.skillsOffered.join(", ")}. Format using the Google-style Action-Context-Result structure.`;
        break;
      case "matches":
        prompt = `Analyze my profile skills and suggest what secondary or adjacent skills I should look to learn next on SkillSync to maximize my career potential.`;
        break;
      case "headline":
        prompt = `Draft 3 highly professional, engaging options for my SkillSync profile headline showing I teach: ${currentUser.skillsOffered.join(", ")} and seek: ${currentUser.skillsWanted.join(", ")}.`;
        break;
    }
    handleSend(prompt);
  };

  const renderFormattedText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      let content: React.ReactNode = line;


      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(line)) {
        const parts = line.split(/\*\*/g);
        content = parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-brand-primary-hover font-bold">{part}</strong> : part));
      }


      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={idx} className="ml-5 list-disc mt-1 text-slate-300 leading-relaxed text-xs">
            {content}
          </li>
        );
      }


      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="ml-2 pl-1.5 border-l-2 border-brand-primary/30 my-2 text-slate-300 text-xs leading-relaxed font-sans">
            {content}
          </div>
        );
      }


      if (line.trim().startsWith("###")) {
        return (
          <h5 key={idx} className="text-sm font-bold text-white font-display tracking-tight mt-4 mb-2">
            {line.replace("###", "").trim()}
          </h5>
        );
      }
      if (line.trim().startsWith("##")) {
        return (
          <h4 key={idx} className="text-base font-bold text-slate-100 font-display tracking-tight mt-6 mb-3">
            {line.replace("##", "").trim()}
          </h4>
        );
      }


      return line.trim() ? (
        <p key={idx} className="leading-relaxed text-xs text-slate-300 mb-2 font-sans whitespace-pre-wrap">
          {content}
        </p>
      ) : (
        <div key={idx} className="h-2" />
      );
    });
  };

  return (
    <div id="ai-assistant-view" className="flex flex-col h-[calc(100vh-64px)] md:h-screen font-sans">


      <div className="p-4 border-b border-brand-border/40 flex items-center justify-between shrink-0 bg-brand-sec-bg/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-accent/10">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 flex items-center gap-1">
              Syncy AI <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] px-1.5 py-0.5 rounded font-mono">LIVE</span>
            </h1>
            <p className="text-[10px] text-slate-500">Your AI companion for mastering skills and building your career</p>
          </div>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-2xl ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white border ${msg.role === "user"
                ? "bg-brand-secondary/20 border-brand-secondary/30"
                : "bg-gradient-to-tr from-brand-primary to-brand-accent border-brand-primary/30"
                }`}>
                {msg.role === "user" ? currentUser.name[0] : <Bot className="w-4.5 h-4.5 text-white" />}
              </div>


              <div className={`p-4 rounded-2xl shadow-md ${msg.role === "user"
                ? "bg-brand-primary text-white rounded-tr-none"
                : "bg-brand-card/85 border border-brand-border text-slate-200 rounded-tl-none"
                }`}>
                {msg.role === "user" ? (
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="space-y-1">
                    {renderFormattedText(msg.text)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}


        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent border border-brand-primary/30 shrink-0 flex items-center justify-center animate-spin">
                <RefreshCw className="w-4 h-4 text-white" />
              </div>
              <div className="bg-brand-card border border-brand-border p-4 rounded-2xl rounded-tl-none shadow-md space-y-2 w-64 animate-pulse">
                <div className="h-3 bg-slate-700 rounded-full w-3/4" />
                <div className="h-3 bg-slate-700 rounded-full w-5/6" />
                <div className="h-3 bg-slate-700 rounded-full w-1/2" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>


      <div className="p-4 border-t border-brand-border/40 bg-brand-sec-bg/25 shrink-0">


        {messages.length < 3 && !isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <button
              onClick={() => handleQuickPrompt("roadmap")}
              className="p-3 rounded-xl bg-brand-card/50 border border-brand-border/80 hover:border-brand-primary/50 text-left space-y-1 group transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" />
              <h5 className="text-[10px] font-bold text-slate-200">Study Roadmap</h5>
              <p className="text-[9px] text-slate-500 line-clamp-1">Generate a 4-week learning flow</p>
            </button>

            <button
              onClick={() => handleQuickPrompt("resume")}
              className="p-3 rounded-xl bg-brand-card/50 border border-brand-border/80 hover:border-brand-primary/50 text-left space-y-1 group transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-brand-accent group-hover:scale-110 transition-transform" />
              <h5 className="text-[10px] font-bold text-slate-200">Resume bullets</h5>
              <p className="text-[9px] text-slate-500 line-clamp-1">Google-style resume points</p>
            </button>

            <button
              onClick={() => handleQuickPrompt("matches")}
              className="p-3 rounded-xl bg-brand-card/50 border border-brand-border/80 hover:border-brand-primary/50 text-left space-y-1 group transition-colors cursor-pointer"
            >
              <Brain className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
              <h5 className="text-[10px] font-bold text-slate-200">Adjacent Skills</h5>
              <p className="text-[9px] text-slate-500 line-clamp-1">Analyze my profile track</p>
            </button>

            <button
              onClick={() => handleQuickPrompt("headline")}
              className="p-3 rounded-xl bg-brand-card/50 border border-brand-border/80 hover:border-brand-primary/50 text-left space-y-1 group transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-brand-secondary group-hover:scale-110 transition-transform" />
              <h5 className="text-[10px] font-bold text-slate-200">Refine Headlines</h5>
              <p className="text-[9px] text-slate-500 line-clamp-1">Craft 3 branding options</p>
            </button>
          </div>
        )}


        <div className="flex items-center gap-2 bg-brand-bg rounded-xl border border-brand-border/80 px-4 py-1 focus-within:border-brand-primary transition-colors">
          <input
            id="ai-prompt-input"
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            disabled={isLoading}
            placeholder={isLoading ? "Syncy is brainstorming..." : "Ask Syncy AI career roadmaps, bio hooks, interview tips..."}
            className="w-full py-3.5 bg-transparent text-slate-200 text-xs focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
          />

          <button
            id="btn-ai-prompt-send"
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="px-4 cursor-pointer py-2 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent hover:from-brand-primary-hover hover:to-brand-accent text-white font-bold text-xs disabled:opacity-30 disabled:pointer-events-none transition-all shrink-0 flex items-center gap-1"
          >
            Ask AI <Send className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
