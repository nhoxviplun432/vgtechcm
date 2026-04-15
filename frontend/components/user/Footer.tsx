import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/gioi-thieu",   label: "Giới thiệu" },
  { href: "/san-pham",     label: "Sản phẩm" },
  { href: "/lien-he",      label: "Liên hệ" },
  { href: "/chinh-sach",   label: "Chính sách" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-5">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div>
            <span className="bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-base font-bold text-transparent">
              VGTech MD
            </span>
            <p className="mt-1 text-xs text-slate-500">
              Bản đồ năng lượng · Human Design · Thần số học
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-4">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} VGTech MD. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
