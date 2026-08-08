"use client";

import { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Shield } from "lucide-react";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      "We collect information you provide directly to us when you create an account, enroll in a course, or contact support including your name, email address, and payment details.",
      "We also automatically collect certain information when you use our platform, such as your IP address, browser type, device information, and how you interact with our courses.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    content: [
      "We use the information we collect to provide, maintain, and improve our services including processing payments, delivering course content, and issuing certificates.",
      "We may also use your information to send you course updates, respond to support requests, and communicate important changes to our platform or policies.",
    ],
  },
  {
    id: "information-sharing",
    title: "3. Information Sharing",
    content: [
      "We do not sell your personal information. We may share your information with trusted third-party service providers who help us operate our platform, such as payment processors and hosting providers.",
      "We may disclose information if required by law or to protect the rights, property, or safety of ELearnSpace, our users, or others.",
    ],
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information, including encryption of sensitive data such as payment details.",
      "While we take reasonable steps to protect your data, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking",
    content: [
      "We use cookies and similar technologies to remember your preferences, keep you logged in, and understand how you use our platform.",
      "You can control cookie preferences through your browser settings, though disabling cookies may affect certain platform features.",
    ],
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    content: [
      "You have the right to access, update, or delete your personal information at any time through your account settings.",
      "You may also request a copy of the data we hold about you, or ask us to restrict certain processing, by contacting our support team.",
    ],
  },
  {
    id: "changes-to-policy",
    title: "7. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the effective date below.",
    ],
  },
  {
    id: "contact-us",
    title: "8. Contact Us",
    content: [
      "If you have any questions about this Privacy Policy or how we handle your data, please reach out to us at support@elearnspace.com.",
    ],
  },
];

const PolicyPage = () => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    document.title = "Privacy Policy • eLearnSpace";
  }, []);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={3}
        route={route}
        setRoute={setRoute}
      />

      {/* Header banner */}
      <section className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-white py-16 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />

        <div className="relative mx-auto w-[90%] max-w-4xl text-center 800:w-[80%]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/20">
            <Shield className="h-7 w-7" />
          </span>

          <h1 className="mt-5 font-poppins text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Effective date: August 1, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative mx-auto w-[90%] max-w-6xl py-16 800:w-[80%]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr]">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-[100px]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                On this page
              </p>
              <nav className="space-y-1 border-l border-slate-200 dark:border-slate-800">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      block w-full border-l-2 py-1.5 pl-4 text-left text-sm transition-colors duration-200
                      ${
                        activeId === section.id
                          ? "border-emerald-600 font-semibold text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                          : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                      }
                    `}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy text */}
          <div className="max-w-3xl">
            <p className="mb-10 text-base leading-8 text-slate-600 dark:text-slate-300">
              This Privacy Policy explains how ELearnSpace collects, uses,
              and protects your personal information when you use our
              platform. By using ELearnSpace, you agree to the practices
              described in this policy.
            </p>

            <div className="space-y-10">
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-[100px] border-b border-slate-100 pb-10 last:border-none dark:border-slate-800"
                >
                  <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white">
                    {section.title}
                  </h2>

                  <div className="mt-4 space-y-4">
                    {section.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="text-[15px] leading-7 text-slate-600 dark:text-slate-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact card */}
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Questions about this policy?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Reach out to our support team and we will be happy to help.
              </p>
               <a
                href="mailto:support@elearnspace.com"
                className="mt-3 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                support@elearnspace.com →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PolicyPage;