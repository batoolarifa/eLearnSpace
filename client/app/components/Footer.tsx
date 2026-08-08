import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  GraduationCap,
} from "lucide-react";


import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer
      className="
       relative overflow-hidden
        border-t border-emerald-100
        bg-gradient-to-b from-white to-emerald-50/40
        dark:border-slate-800 dark:from-slate-950 dark:to-slate-900
      "
    >
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10" />

      {/* Main footer content */}
      <div className="relative mx-auto w-[90%] max-w-6xl py-16 800:w-[80%]">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-poppins text-xl font-bold text-slate-900 dark:text-white">
                ELearn<span className="text-emerald-600 dark:text-emerald-400">Space</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-400">
              ELearnSpace helps you master modern technologies through
              expert-led courses, real-world projects, and a community built
              to keep you moving forward.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                support@elearnspace.com
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                123 Learning Ave, San Francisco, CA
              </div>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {[
            FaFacebookF,
            FaXTwitter,
            FaInstagram,
            FaLinkedinIn,
            FaYoutube,
          ].map(
                (Icon, i) => (
                   <a
                    key={i}
                    href="#"
                    className="
                      flex h-9 w-9 items-center justify-center rounded-full
                      bg-emerald-50 text-emerald-600 transition-colors duration-300
                      hover:bg-emerald-600 hover:text-white
                      dark:bg-slate-800 dark:text-emerald-400
                      dark:hover:bg-emerald-600 dark:hover:text-white
                    "
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Courses", href: "/courses" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Courses
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { label: "Web Development", href: "/courses?category=web-development" },
                { label: "Data Science", href: "/courses?category=data-science" },
                { label: "UI/UX Design", href: "/courses?category=design" },
                { label: "Mobile Development", href: "/courses?category=mobile" },
                { label: "Cloud & DevOps", href: "/courses?category=cloud" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Account
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { label: "My Profile", href: "/profile" },
                { label: "Enrolled Courses", href: "/course-access" },
                { label: "Login", href: "/login" },
                { label: "Sign Up", href: "/signup" },
                { label: "Settings", href: "/profile?tab=settings" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-emerald-100 dark:border-slate-800">
        <div className="mx-auto flex w-[90%] max-w-6xl flex-col items-center justify-between gap-4 py-6 text-sm text-slate-500 800:w-[80%] sm:flex-row dark:text-slate-400">
          <p>© {new Date().getFullYear()} ELearnSpace. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;