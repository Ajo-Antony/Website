import Link from "next/link";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export default function FooterCommonSharedComponent() {
  return (
    <footer className="border-t border-white/6 py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <Link href="/" className={`${spaceMono.className} text-base font-bold text-white`}>
              Strix<span className="text-[#6c63ff]">Mind</span>
            </Link>
            <p className="text-xs text-white/25 mt-1">AI-Powered Business Operating System</p>
          </div>

          <ul className="flex flex-wrap gap-8 list-none">
            {["Services", "How it works", "Why us", "Contact", "Privacy"].map((item) => (
              <li key={item}>
                <Link
                  href={`/#${item.toLowerCase().replace(/\s+/g, "")}`}
                  className={`${spaceMono.className} text-[0.65rem] tracking-[0.1em] uppercase text-white/25 hover:text-white transition-colors`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <p className={`${spaceMono.className} text-[0.65rem] tracking-wider text-white/25`}>
            © {new Date().getFullYear()} StrixMind LLP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
