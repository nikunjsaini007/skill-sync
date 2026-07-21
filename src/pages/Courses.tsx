export default function Courses() {
  return (
    <div className="min-h-screen bg-brand-bg px-6 py-16 text-slate-200">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl font-bold text-slate-100">
            Courses
          </h1>

          <p className="mt-4 text-slate-400">
            Learn new skills from curated resources and community experts.
          </p>
        </div>


        {/* Coming Soon Card */}
        <div className="group relative overflow-hidden rounded-[2rem] border border-brand-border/50 bg-gradient-to-br from-brand-card/80 via-brand-card/60 to-brand-sec-bg/80 p-10 text-center shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl">

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10 opacity-0 transition duration-500 group-hover:opacity-100" />

          <div className="relative">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-brand-primary to-brand-accent text-4xl shadow-lg shadow-brand-primary/30">
              🚧
            </div>

            <h2 className="mt-8 font-display text-3xl font-bold text-slate-100">
              Coming Soon
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-400">
              We're currently working on this section and it'll be available
              in a future update.
            </p>

            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-400">
              Soon you'll be able to explore curated courses, improve your
              skills, and learn from the SkillSync community.
            </p>

            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-400">
              Thank you for being part of SkillSync's journey. Stay tuned for
              exciting updates!
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}