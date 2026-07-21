export default function Privacy() {
  return (
    <div className="min-h-screen bg-brand-bg px-6 py-16 text-slate-200">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl font-bold text-slate-100">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: June 2026
          </p>
        </div>


        {/* Content */}
        <div className="space-y-8 rounded-[2rem] border border-brand-border/50 bg-gradient-to-br from-brand-card/80 via-brand-card/60 to-brand-sec-bg/80 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl md:p-12">


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              1. Introduction
            </h2>
            <p className="leading-relaxed text-slate-400">
              Welcome to SkillSync. We value your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how
              we collect, use, store, and protect your information when you use
              our platform. By using SkillSync, you agree to the practices
              described in this policy.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              2. Information We Collect
            </h2>

            <p className="text-slate-400">
              We collect the following types of information to provide and
              improve our services:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-400">
              <li>
                <b className="text-slate-300">Account Information:</b> Name,
                email address, password, and profile details you provide during
                registration.
              </li>

              <li>
                <b className="text-slate-300">Profile Information:</b> Skills,
                interests, bio, profile picture, and other information you
                choose to add.
              </li>

              <li>
                <b className="text-slate-300">Usage Data:</b> Interactions with
                the platform such as pages visited, features used, and
                engagement activity.
              </li>

              <li>
                <b className="text-slate-300">Device & Technical Data:</b> IP
                address, browser type, device information, and operating system.
              </li>
            </ul>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              3. How We Use Your Information
            </h2>

            <p className="text-slate-400">
              Your information is used to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-400">
              <li>Create and manage your account</li>
              <li>Enable skill matching and user connections</li>
              <li>Improve platform performance and user experience</li>
              <li>Personalize recommendations and learning opportunities</li>
              <li>Ensure platform safety, security, and fraud prevention</li>
              <li>Communicate important updates or notifications</li>
            </ul>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              4. Sharing of Information
            </h2>

            <p className="leading-relaxed text-slate-400">
              We do not sell, rent, or trade your personal information. We may
              share limited data only with trusted service providers, legal
              authorities when required, or to protect the safety and security
              of SkillSync and its users.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              5. Cookies and Tracking Technologies
            </h2>

            <p className="leading-relaxed text-slate-400">
              SkillSync uses cookies and similar technologies to keep you
              logged in, remember preferences, analyze usage, and improve
              platform performance.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              6. Data Storage and Security
            </h2>

            <p className="leading-relaxed text-slate-400">
              We implement reasonable administrative, technical, and physical
              security measures to protect your data. However, no online
              storage method can guarantee absolute security.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              7. Data Retention
            </h2>

            <p className="leading-relaxed text-slate-400">
              We retain personal information only as long as necessary to
              provide services, comply with legal obligations, resolve disputes,
              and enforce agreements.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              8. Your Rights
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-slate-400">
              <li>Access your personal data</li>
              <li>Update or correct your information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent where applicable</li>
            </ul>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              9. Third-Party Services
            </h2>

            <p className="leading-relaxed text-slate-400">
              SkillSync may use third-party services for analytics, hosting,
              authentication, or communication. These providers are expected to
              protect your information.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              10. Children's Privacy
            </h2>

            <p className="leading-relaxed text-slate-400">
              SkillSync is not intended for users under the age of 13. We do not
              knowingly collect personal data from children.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              11. Changes to This Policy
            </h2>

            <p className="leading-relaxed text-slate-400">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated revision date.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-bold text-slate-100">
              12. Contact Us
            </h2>

            <p className="text-slate-400">
              If you have questions about this Privacy Policy, contact us at:
              {" "}
              <b className="text-slate-300">
                skillsync.founder@gmail.com
              </b>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}