"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateProfile, updateAvatar, resetPassword, type AuthUser } from "@/lib/auth";
import { ErrorMsg } from "@/components/pakage/ErrorMsg";

/* ------------------------------------------------------------------ */
/* Shared                                                               */
/* ------------------------------------------------------------------ */
const fieldClass = (hasErr: boolean) =>
  `w-full h-11 rounded-xl border bg-white/5 px-4 text-sm text-white
   placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-colors ${
    hasErr
      ? "border-red-400/60 focus:ring-red-400/20"
      : "border-white/10 focus:border-fuchsia-400/60 focus:ring-fuchsia-400/20"
  }`;

const Spinner = ({ sm }: { sm?: boolean }) => (
  <svg className={`${sm ? "h-3.5 w-3.5" : "h-4 w-4"} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

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

const CameraIcon = () => (
  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* AvatarCol — left 30%                                                 */
/* ------------------------------------------------------------------ */
function AvatarCol({ user, onUpdate }: { user: AuthUser; onUpdate: (u: AuthUser) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  const initial   = user.fullname.trim().charAt(0).toUpperCase();
  const avatarSrc = preview ?? user.avatar_url ?? null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Chỉ hỗ trợ JPG, PNG, WEBP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ảnh không vượt quá 2MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    handleUpload(file);
  }

  async function handleUpload(file: File) {
    setLoading(true);
    setSuccess(false);
    try {
      const updated = await updateAvatar(file);
      onUpdate(updated);
      setPreview(null);
      window.dispatchEvent(new CustomEvent("user:avatarUpdated", { detail: updated }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Tải ảnh thất bại.");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      {/* Avatar — min 200px */}
      <div className="relative group" style={{ minWidth: 200, minHeight: 200 }}>
        <div
          className="rounded-full overflow-hidden ring-4 ring-fuchsia-500/30
                     bg-linear-to-br from-fuchsia-500 to-indigo-500
                     flex items-center justify-center font-bold text-white select-none"
          style={{ width: 200, height: 200, fontSize: 72 }}
        >
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt="avatar" loading="eager"
              style={{ width: 200, height: 200, objectFit: "cover", borderRadius: "9999px" }} />
          ) : (
            initial
          )}
        </div>

        {/* Hover overlay */}
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1.5
                     bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity
                     disabled:cursor-not-allowed"
          aria-label="Đổi ảnh đại diện"
        >
          {loading ? <Spinner /> : <CameraIcon />}
          {!loading && (
            <span className="text-xs font-medium text-white/90">Thay đổi</span>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Name + email under avatar */}
      <div className="text-center space-y-0.5">
        <p className="text-base font-semibold text-white">{user.fullname}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>

      {/* Upload hint */}
      <p className="text-xs text-gray-600 text-center leading-relaxed">
        JPG, PNG, WEBP<br />tối đa 2MB
      </p>

      {error   && <p className="text-xs text-red-400 text-center">{error}</p>}
      {success && <p className="text-xs text-emerald-400 text-center">Cập nhật ảnh thành công!</p>}
      {loading && (
        <p className="text-xs text-fuchsia-400 flex items-center gap-1.5">
          <Spinner sm /> Đang tải lên…
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FullnameForm                                                         */
/* ------------------------------------------------------------------ */
function FullnameForm({ user, onUpdate }: { user: AuthUser; onUpdate: (u: AuthUser) => void }) {
  const [value, setValue]       = useState(user.fullname);
  const [touched, setTouched]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  const error = useMemo(() => {
    if (!touched) return undefined;
    const n = value.trim();
    if (!n) return "Vui lòng nhập họ và tên.";
    if (n.length < 2) return "Họ tên ít nhất 2 ký tự.";
    if (/[0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(n))
      return "Họ tên không chứa số hoặc ký tự đặc biệt.";
    return undefined;
  }, [value, touched]);

  const dirty = value.trim() !== user.fullname;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setApiError(null);
    const n = value.trim();
    if (!n || n.length < 2 || error) return;

    setLoading(true);
    setSuccess(false);
    try {
      const updated = await updateProfile(n);
      onUpdate(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Họ và tên</label>
        <input
          type="text"
          value={value}
          placeholder="Nguyễn Văn A"
          onChange={e => { setValue(e.target.value); setSuccess(false); }}
          onBlur={() => setTouched(true)}
          className={fieldClass(!!error)}
        />
        <ErrorMsg msg={error} />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="w-full h-11 rounded-xl border border-white/5 bg-white/3 px-4
                     text-sm text-gray-500 cursor-not-allowed select-none"
        />
        <p className="mt-1 text-xs text-gray-600">Email không thể thay đổi.</p>
      </div>

      {apiError && (
        <div className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{apiError}</div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">
          Cập nhật thành công!
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !dirty || !!error}
        className="h-10 px-5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500
                   text-sm font-semibold text-white hover:opacity-90 transition-opacity
                   disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-2"
      >
        {loading ? <><Spinner sm />Đang lưu…</> : "Lưu thay đổi"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* PasswordForm                                                         */
/* ------------------------------------------------------------------ */
function PasswordForm() {
  const [current, setCurrent]         = useState("");
  const [next, setNext]               = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState<string | null>(null);
  const [success, setSuccess]         = useState(false);
  const [touched, setTouched]         = useState<{
    current?: boolean; next?: boolean; confirm?: boolean;
  }>({});

  const errors = useMemo(() => {
    const e: { current?: string; next?: string; confirm?: string } = {};
    if (touched.current && !current) e.current = "Vui lòng nhập mật khẩu hiện tại.";
    if (touched.next) {
      if (!next) e.next = "Vui lòng nhập mật khẩu mới.";
      else if (next.length < 8) e.next = "Mật khẩu mới ít nhất 8 ký tự.";
    }
    if (touched.confirm) {
      if (!confirm) e.confirm = "Vui lòng xác nhận mật khẩu mới.";
      else if (confirm !== next) e.confirm = "Mật khẩu xác nhận không khớp.";
    }
    return e;
  }, [current, next, confirm, touched]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ current: true, next: true, confirm: true });
    setApiError(null);
    if (!current || !next || next.length < 8 || confirm !== next) return;

    setLoading(true);
    setSuccess(false);
    try {
      await resetPassword(current, next, confirm);
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
      setTouched({});
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  }

  function pwField(
    val: string, setVal: (v: string) => void,
    show: boolean, setShow: (v: boolean) => void,
    touchKey: "current" | "next" | "confirm",
    placeholder: string,
    err?: string
  ) {
    return (
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={val}
          placeholder={placeholder}
          onChange={e => { setVal(e.target.value); setSuccess(false); }}
          onBlur={() => setTouched(p => ({ ...p, [touchKey]: true }))}
          className={`${fieldClass(!!err)} pr-10`}
        />
        <button
          type="button" tabIndex={-1}
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Mật khẩu hiện tại</label>
        {pwField(current, setCurrent, showCurrent, setShowCurrent, "current", "••••••••", errors.current)}
        <ErrorMsg msg={errors.current} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Mật khẩu mới</label>
        {pwField(next, setNext, showNext, setShowNext, "next", "Tối thiểu 8 ký tự", errors.next)}
        <ErrorMsg msg={errors.next} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Xác nhận mật khẩu mới</label>
        {pwField(confirm, setConfirm, showConfirm, setShowConfirm, "confirm", "Nhập lại mật khẩu mới", errors.confirm)}
        <ErrorMsg msg={errors.confirm} />
      </div>

      {apiError && (
        <div className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{apiError}</div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">
          Đổi mật khẩu thành công!
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-10 px-5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500
                   text-sm font-semibold text-white hover:opacity-90 transition-opacity
                   disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-2"
      >
        {loading ? <><Spinner sm />Đang đổi…</> : "Đổi mật khẩu"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getMe().then(u => {
      if (!u) { router.replace("/"); return; }
      setUser(u);
      setChecking(false);
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(".user-scroll-container");
        if (el) el.scrollTop = 0;
      });
    });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:pt-32 sm:pb-20">

        {/* Page heading */}
        <div className="mb-8 w-full">
          <h1 className="text-2xl font-bold text-white">Hồ sơ cá nhân</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* Two-column layout: 30% avatar | 70% info */}
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

          {/* ── Left col: avatar (30%) ── */}
          <div className="w-full lg:w-[30%]">
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">
                Ảnh đại diện
              </p>
              <AvatarCol user={user} onUpdate={setUser} />
            </div>
          </div>

          {/* ── Right col: info + password (70%) ── */}
          <div className="w-full lg:w-[70%]">
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6
                            flex flex-col lg:flex-row gap-6 items-start">

              <div className="w-full lg:w-1/2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
                  Thông tin
                </p>
                <FullnameForm user={user} onUpdate={setUser} />
              </div>

              <div className="w-full lg:w-px self-stretch bg-white/10 hidden lg:block" />

              <div className="w-full lg:w-1/2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
                  Đổi mật khẩu
                </p>
                <PasswordForm />
              </div>

            </div>
          </div>

        </div>

      </section>
    </main>
  );
}
