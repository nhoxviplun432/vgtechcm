"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ErrorMsg } from "@/components/pakage/ErrorMsg";
import { login, register, logout, getMe, type AuthUser } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/",         label: "Human Design" },
  { href: "/pricing",  label: "Gói" },
  { href: "/contact",  label: "Giới thiệu" },
  { href: "/affiliate",label: "Tiếp thị" },
] as const;

/* ------------------------------------------------------------------ */
/* Shared helpers                                                        */
/* ------------------------------------------------------------------ */
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

const fieldClass = (hasErr: boolean) =>
  `w-full h-11 rounded-xl border bg-white/5 px-4 text-sm text-white
   placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-colors ${
    hasErr
      ? "border-red-400/60 focus:ring-red-400/20"
      : "border-white/10 focus:border-fuchsia-400/60 focus:ring-fuchsia-400/20"
  }`;

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* UserMenu — mini dropdown shown when logged in                        */
/* ------------------------------------------------------------------ */
function UserMenu({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = user.fullname.trim().charAt(0).toUpperCase();

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="hidden md:flex h-9 w-9 items-center justify-center rounded-full
                   bg-linear-to-br from-fuchsia-500 to-indigo-500
                   text-sm font-bold text-white shadow
                   ring-2 ring-transparent hover:ring-fuchsia-400/50 transition-all"
        aria-label="Tài khoản"
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10
                        bg-gray-950/95 backdrop-blur-md shadow-2xl overflow-hidden z-300">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold text-white truncate">{user.fullname}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>

          {/* Items */}
          <div className="py-1">
            <Link href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300
                         hover:bg-white/5 hover:text-white transition-colors">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Hồ sơ
            </Link>

            <Link href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300
                         hover:bg-white/5 hover:text-white transition-colors">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              Dashboard
            </Link>
          </div>

          <div className="border-t border-white/10 py-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400
                         hover:bg-red-500/10 hover:text-red-300 transition-colors">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LoginForm                                                            */
/* ------------------------------------------------------------------ */
function LoginForm({ onSwitchRegister, onSuccess }: {
  onSwitchRegister: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [touched, setTouched]   = useState<{ email?: boolean; password?: boolean }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const errors = useMemo(() => {
    const e: { email?: string; password?: string } = {};
    if (touched.email) {
      if (!email.trim()) e.email = "Vui lòng nhập email.";
      else if (!isValidEmail(email)) e.email = "Email không hợp lệ.";
    }
    if (touched.password) {
      if (!password) e.password = "Vui lòng nhập mật khẩu.";
      else if (password.length < 6) e.password = "Mật khẩu ít nhất 6 ký tự.";
    }
    return e;
  }, [email, password, touched]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setApiError(null);

    const e2: { email?: string; password?: string } = {};
    if (!email.trim()) e2.email = "Vui lòng nhập email.";
    else if (!isValidEmail(email)) e2.email = "Email không hợp lệ.";
    if (!password) e2.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6) e2.password = "Mật khẩu ít nhất 6 ký tự.";
    if (Object.keys(e2).length > 0) return;

    setLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-xl font-bold text-white mb-1">Đăng nhập</h2>
      <p className="text-sm text-gray-400 mb-6">Chào mừng bạn quay trở lại</p>

      {apiError && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{apiError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
          <input type="email" value={email} placeholder="you@example.com"
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(p => ({ ...p, email: true }))}
            className={fieldClass(!!errors.email)} />
          <ErrorMsg msg={errors.email} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Mật khẩu</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={password} placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              onBlur={() => setTouched(p => ({ ...p, password: true }))}
              className={`${fieldClass(!!errors.password)} pr-10`} />
            <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              <EyeIcon open={showPw} />
            </button>
          </div>
          <ErrorMsg msg={errors.password} />
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
            Quên mật khẩu?
          </button>
        </div>

        <button type="submit" disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500
                     text-sm font-semibold text-white hover:opacity-90 transition-opacity
                     disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Spinner />Đang đăng nhập…</> : "Đăng nhập"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-gray-500">hoặc</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <button type="button"
        className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-white/10
                   bg-white/5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
        <GoogleIcon />Tiếp tục với Google
      </button>

      <p className="mt-5 text-center text-xs text-gray-500">
        Chưa có tài khoản?{" "}
        <button type="button" onClick={onSwitchRegister}
          className="text-fuchsia-400 hover:text-fuchsia-300 font-medium transition-colors">
          Đăng ký ngay
        </button>
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* RegisterForm                                                         */
/* ------------------------------------------------------------------ */
function RegisterForm({ onSwitchLogin, onSuccess }: {
  onSwitchLogin: () => void;
  onSuccess: () => void;
}) {
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCPw, setShowCPw]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState<string | null>(null);
  const [touched, setTouched]     = useState<{
    fullName?: boolean; email?: boolean; password?: boolean; confirmPw?: boolean;
  }>({});

  const errors = useMemo(() => {
    const e: { fullName?: string; email?: string; password?: string; confirmPw?: string } = {};
    if (touched.fullName) {
      const n = fullName.trim();
      if (!n) e.fullName = "Vui lòng nhập họ và tên.";
      else if (n.length < 2) e.fullName = "Họ tên ít nhất 2 ký tự.";
      else if (/[0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(n))
        e.fullName = "Họ tên không chứa số hoặc ký tự đặc biệt.";
    }
    if (touched.email) {
      if (!email.trim()) e.email = "Vui lòng nhập email.";
      else if (!isValidEmail(email)) e.email = "Email không hợp lệ.";
    }
    if (touched.password) {
      if (!password) e.password = "Vui lòng nhập mật khẩu.";
      else if (password.length < 6) e.password = "Mật khẩu ít nhất 6 ký tự.";
    }
    if (touched.confirmPw) {
      if (!confirmPw) e.confirmPw = "Vui lòng xác nhận mật khẩu.";
      else if (confirmPw !== password) e.confirmPw = "Mật khẩu xác nhận không khớp.";
    }
    return e;
  }, [fullName, email, password, confirmPw, touched]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ fullName: true, email: true, password: true, confirmPw: true });
    setApiError(null);

    const e2: typeof errors = {};
    const n = fullName.trim();
    if (!n) e2.fullName = "Vui lòng nhập họ và tên.";
    else if (n.length < 2) e2.fullName = "Họ tên ít nhất 2 ký tự.";
    if (!email.trim()) e2.email = "Vui lòng nhập email.";
    else if (!isValidEmail(email)) e2.email = "Email không hợp lệ.";
    if (!password) e2.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6) e2.password = "Mật khẩu ít nhất 6 ký tự.";
    if (!confirmPw) e2.confirmPw = "Vui lòng xác nhận mật khẩu.";
    else if (confirmPw !== password) e2.confirmPw = "Mật khẩu xác nhận không khớp.";
    if (Object.keys(e2).length > 0) return;

    setLoading(true);
    try {
      await register(fullName.trim(), email, password, confirmPw);
      onSuccess();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-xl font-bold text-white mb-1">Tạo tài khoản</h2>
      <p className="text-sm text-gray-400 mb-6">Bắt đầu hành trình khám phá bản thân</p>

      {apiError && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{apiError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Họ và tên</label>
          <input type="text" value={fullName} placeholder="Nguyễn Văn A"
            onChange={e => setFullName(e.target.value)}
            onBlur={() => setTouched(p => ({ ...p, fullName: true }))}
            className={fieldClass(!!errors.fullName)} />
          <ErrorMsg msg={errors.fullName} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
          <input type="email" value={email} placeholder="you@example.com"
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(p => ({ ...p, email: true }))}
            className={fieldClass(!!errors.email)} />
          <ErrorMsg msg={errors.email} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Mật khẩu</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={password} placeholder="Tối thiểu 6 ký tự"
              onChange={e => setPassword(e.target.value)}
              onBlur={() => setTouched(p => ({ ...p, password: true }))}
              className={`${fieldClass(!!errors.password)} pr-10`} />
            <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              <EyeIcon open={showPw} />
            </button>
          </div>
          <ErrorMsg msg={errors.password} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Xác nhận mật khẩu</label>
          <div className="relative">
            <input type={showCPw ? "text" : "password"} value={confirmPw} placeholder="Nhập lại mật khẩu"
              onChange={e => setConfirmPw(e.target.value)}
              onBlur={() => setTouched(p => ({ ...p, confirmPw: true }))}
              className={`${fieldClass(!!errors.confirmPw)} pr-10`} />
            <button type="button" tabIndex={-1} onClick={() => setShowCPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              <EyeIcon open={showCPw} />
            </button>
          </div>
          <ErrorMsg msg={errors.confirmPw} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500
                     text-sm font-semibold text-white hover:opacity-90 transition-opacity
                     disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Spinner />Đang tạo tài khoản…</> : "Đăng ký"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-gray-500">hoặc</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <button type="button"
        className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-white/10
                   bg-white/5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
        <GoogleIcon />Đăng ký với Google
      </button>

      <p className="mt-5 text-center text-xs text-gray-500">
        Đã có tài khoản?{" "}
        <button type="button" onClick={onSwitchLogin}
          className="text-fuchsia-400 hover:text-fuchsia-300 font-medium transition-colors">
          Đăng nhập
        </button>
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* AuthModal — bọc Login + Register trong 1 popup                      */
/* ------------------------------------------------------------------ */
function AuthModal({ initialMode = "login", onClose, onSuccess }: {
  initialMode?: "login" | "register";
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl border border-white/10
                      bg-gray-950/90 backdrop-blur-md p-8 shadow-2xl
                      max-h-[90vh] overflow-y-auto
                      [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Đóng">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {mode === "login"
          ? <LoginForm onSwitchRegister={() => setMode("register")} onSuccess={onSuccess} />
          : <RegisterForm onSwitchLogin={() => setMode("login")} onSuccess={onSuccess} />
        }
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */
export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen]   = useState(false);
  const [user, setUser]             = useState<AuthUser | null>(null);

  // Check existing session on mount
  useEffect(() => {
    getMe().then(setUser);
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
    router.push("/");
  }

  async function handleAuthSuccess() {
    setLoginOpen(false);
    const me = await getMe();
    setUser(me);
  }

  return (
    <>
      <header
        id="site-header"
        className="fixed top-5 left-0 w-full z-50 transition-all duration-300"
      >
        <div className="mx-auto max-w-7xl px-3">
          <div
            className="flex justify-between items-center h-16 px-5
                       bg-white/80 dark:bg-black/80 backdrop-blur-md
                       rounded-xl border border-gray-100 dark:border-gray-800
                       transition-all duration-300"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent">
                VGTech MD
              </span>
            </Link>

            {/* Nav — desktop */}
            <nav className="hidden md:flex gap-8 text-gray-700 dark:text-gray-300 text-sm font-medium">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href}
                  className="transition-colors hover:text-black dark:hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Desktop: UserMenu or Login button */}
              {user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="hidden md:inline-flex items-center justify-center
                              rounded-full bg-black dark:bg-white p-2
                              text-white dark:text-gray-900
                              transition-colors hover:bg-gray-800 dark:hover:bg-gray-100"
                  aria-label="Đăng nhập"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}

              {/* Hamburger — mobile */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              >
                <span className={`block h-0.5 w-5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`fixed top-22 left-0 w-full z-40 md:hidden transition-all duration-300 ${
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-3 shadow-lg">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                {label}
              </Link>
            ))}

            {/* Mobile: user actions */}
            {user ? (
              <>
                <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{user.email}</p>
                  <Link href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-1 transition-colors">
                    Hồ sơ
                  </Link>
                  <Link href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-1 transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="block w-full text-left text-sm font-medium text-red-500 hover:text-red-600 py-1 transition-colors">
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                className="block w-full text-center px-4 py-2 bg-black dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium">
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {loginOpen && (
        <AuthModal
          onClose={() => setLoginOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
