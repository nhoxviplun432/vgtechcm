"use client";

import { useEffect, useReducer, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* ─────────────────────────────────────────────────────────────── types ── */
interface HDProperty {
  name: string;
  id: string;
  description: string;
}

interface PlanetActivation {
  Gate: number;
  Line: number;
  Color: number;
  Tone: number;
  Base: number;
  FixingState: string;
}

interface HDData {
  Properties: {
    BirthDateLocal: string;
    Age: number;
    Type: HDProperty;
    Strategy: HDProperty;
    InnerAuthority: HDProperty;
    Definition: HDProperty;
    Profile: HDProperty;
    IncarnationCross: HDProperty;
    Signature: HDProperty;
    NotSelfTheme: HDProperty;
  };
  Personality: Record<string, PlanetActivation>;
  Design: Record<string, PlanetActivation>;
  DefinedCenters: string[];
  OpenCenters: string[];
  Channels: string[];
  Gates: number[];
  Variables: {
    Digestion: string;
    Environment: string;
    Awareness: string;
    Perspective: string;
  };
}

/* ─────────────────────────────────────────────── type → color config ── */
const TYPE_COLORS: Record<
  string,
  { from: string; to: string; badge: string; glow: string; overlay: string }
> = {
  Manifestor: {
    from: "from-orange-500", to: "to-rose-500",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    glow: "shadow-orange-500/30", overlay: "from-orange-600/30 to-rose-600/20",
  },
  Generator: {
    from: "from-rose-500", to: "to-red-500",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    glow: "shadow-rose-500/30", overlay: "from-rose-600/30 to-red-600/20",
  },
  "Manifesting Generator": {
    from: "from-orange-400", to: "to-fuchsia-500",
    badge: "bg-orange-400/20 text-orange-200 border-orange-400/30",
    glow: "shadow-fuchsia-500/30", overlay: "from-orange-500/30 to-fuchsia-600/20",
  },
  Projector: {
    from: "from-sky-500", to: "to-indigo-500",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    glow: "shadow-sky-500/30", overlay: "from-sky-600/30 to-indigo-600/20",
  },
  Reflector: {
    from: "from-slate-400", to: "to-slate-300",
    badge: "bg-slate-400/20 text-slate-200 border-slate-400/30",
    glow: "shadow-slate-400/30", overlay: "from-slate-500/30 to-slate-400/20",
  },
};
const DEFAULT_COLOR = {
  from: "from-fuchsia-500", to: "to-indigo-500",
  badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  glow: "shadow-fuchsia-500/30", overlay: "from-fuchsia-600/30 to-indigo-600/20",
};

const PLANET_ORDER = [
  "Sun","Earth","Moon","Mercury","Venus","Mars",
  "Jupiter","Saturn","Uranus","Neptune","Pluto","South Node","North Node",
];
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Earth: "⊕", Moon: "☽", Mercury: "☿", Venus: "♀",
  Mars: "♂", Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆",
  Pluto: "♇", "South Node": "☋", "North Node": "☊",
};
const CENTER_LABELS: Record<string, string> = {
  "head center": "Đầu", "ajna center": "Ajna", "throat center": "Họng",
  "g center": "G", "heart center": "Tim", "solar plexus center": "Đám Rối",
  "sacral center": "Xương Cùng", "splenic center": "Lá Lách", "root center": "Gốc",
};

/* ──────────────────────────────────────────────────── carousel slide ── */
interface Slide {
  title: string;
  icon: string;
  bgImage?: string;           // optional image URL — drop a real URL here
  content: React.ReactNode;
}

function Carousel({
  slides,
  current,
  onCurrentChange,
  footer,
}: {
  slides: Slide[];
  current: number;
  onCurrentChange: (n: number) => void;
  footer?: React.ReactNode;
}) {
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    const check = () => setIsMd(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const perView  = isMd ? 1 : 2;
  const slideW   = isMd ? 100 : 50;
  const maxIndex = Math.max(0, slides.length - perView);

  const prev = useCallback(
    () => onCurrentChange(Math.max(0, current - 1)),
    [current, onCurrentChange],
  );
  const next = useCallback(
    () => onCurrentChange(Math.min(maxIndex, current + 1)),
    [current, maxIndex, onCurrentChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <div className="relative px-1">
      {/* ── track ── */}
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * slideW}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="flex-shrink-0 px-2" style={{ width: `${slideW}%` }}>
              <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
                {slide.bgImage && (
                  <div
                    className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: `url('${slide.bgImage}')` }}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(120,80,255,0.12),transparent)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_100%,rgba(30,150,255,0.07),transparent)]" />

                <div className="relative border-b border-white/8 px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{slide.icon}</span>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{slide.title}</p>
                    <span className="ml-auto text-xs text-slate-600">{i + 1} / {slides.length}</span>
                  </div>
                </div>

                <div className="relative flex-1 overflow-y-auto px-6 py-5">{slide.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── prev ── */}
      <button
        onClick={prev}
        disabled={current === 0}
        aria-label="Previous"
        className="absolute left-0 top-1/2 z-10 -translate-x-3 -translate-y-1/2
          flex h-11 w-11 items-center justify-center rounded-full
          border border-white/20 bg-slate-900/90 text-xl text-white shadow-xl
          backdrop-blur-sm transition-all hover:border-white/40 hover:bg-slate-800
          disabled:pointer-events-none disabled:opacity-0"
      >‹</button>

      {/* ── next ── */}
      <button
        onClick={next}
        disabled={current >= maxIndex}
        aria-label="Next"
        className="absolute right-0 top-1/2 z-10 translate-x-3 -translate-y-1/2
          flex h-11 w-11 items-center justify-center rounded-full
          border border-white/20 bg-slate-900/90 text-xl text-white shadow-xl
          backdrop-blur-sm transition-all hover:border-white/40 hover:bg-slate-800
          disabled:pointer-events-none disabled:opacity-0"
      >›</button>

      {/* ── dots + footer ── */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => {
            const active = i >= current && i < current + perView;
            return (
              <button
                key={i}
                onClick={() => onCurrentChange(Math.min(i, maxIndex))}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active ? "w-6 bg-fuchsia-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
        {footer && <div className="text-center">{footer}</div>}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── sub-components ── */
function PropertyCard({
  label, value, description, accent = false,
}: {
  label: string; value: string; description?: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 transition-colors ${
      accent
        ? "border-fuchsia-500/25 bg-fuchsia-500/8 hover:border-fuchsia-500/45"
        : "border-white/10 bg-white/3 hover:border-white/20"
    }`}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
      {description && (
        <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-4">{description}</p>
      )}
    </div>
  );
}

function VariableArrow({ label, direction }: { label: string; direction: string }) {
  const isLeft = direction === "left";
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/3 p-4 text-center">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
        isLeft ? "bg-rose-500/20 text-rose-300" : "bg-sky-500/20 text-sky-300"
      }`}>
        {isLeft ? "←" : "→"}
      </div>
      <span className={`text-xs font-semibold capitalize ${isLeft ? "text-rose-300" : "text-sky-300"}`}>
        {direction}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── error ── */
function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
        <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Không tìm thấy dữ liệu</h1>
        <p className="mt-2 text-slate-400">Không thể lấy bản đồ năng lượng. Vui lòng thử lại.</p>
      </div>
      <button
        onClick={onBack}
        className="rounded-xl bg-linear-to-r from-fuchsia-500 to-indigo-500 px-6 py-2.5
          text-sm font-semibold text-white hover:from-fuchsia-600 hover:to-indigo-600 transition-all"
      >
        Quay lại tra cứu
      </button>
    </section>
  );
}

/* ─────────────────────────────── page state reducer (avoids setState-in-effect) ── */
type PageState = { ready: boolean; data: HDData | null; name: string };
type PageAction =
  | { type: "error" }
  | { type: "loaded"; data: HDData; name: string };

function pageReducer(_s: PageState, a: PageAction): PageState {
  if (a.type === "error")  return { ready: true, data: null, name: "" };
  return { ready: true, data: a.data, name: a.name };
}

/* ─────────────────────────────────────────────────────── main page ── */
export default function HdResultPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const hasError     = searchParams.get("error") === "1";

  const [{ ready, data, name }, dispatch] = useReducer(
    pageReducer,
    { ready: false, data: null, name: "" },
  );

  /* carousel controlled state */
  const [carouselCurrent, setCarouselCurrent] = useState(0);
  const carouselGoTo = useCallback((n: number) => setCarouselCurrent(n), []);

  useEffect(() => {
    if (hasError) { dispatch({ type: "error" }); return; }
    try {
      const raw        = sessionStorage.getItem("hd_result");
      const storedName = sessionStorage.getItem("hd_name") ?? "";
      if (!raw) { router.replace("/"); return; }
      dispatch({ type: "loaded", data: JSON.parse(raw) as HDData, name: storedName });
    } catch {
      router.replace("/");
    }
  }, [hasError, router]);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-fuchsia-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (hasError || !data) return <ErrorState onBack={() => router.push("/")} />;

  const p     = data.Properties;
  const typeId = p.Type?.id ?? "";
  const col    = TYPE_COLORS[typeId] ?? DEFAULT_COLOR;

  const allPlanets = PLANET_ORDER.filter(
    pl => data.Personality?.[pl] || data.Design?.[pl]
  );

  /* ── build slides ── */
  const slides: Slide[] = [
    /* 1 — Core Identity */
    {
      title: "Bản Sắc Cốt Lõi",
      icon: "✦",
      content: (
        <div className="grid gap-3">
          {p.Type && <PropertyCard label="Loại (Type)" value={p.Type.id} description={p.Type.description} accent />}
          {p.Strategy && <PropertyCard label="Chiến Lược" value={p.Strategy.id} description={p.Strategy.description} />}
          {p.InnerAuthority && <PropertyCard label="Quyền Năng Nội Tâm" value={p.InnerAuthority.id} description={p.InnerAuthority.description} />}
        </div>
      ),
    },
    /* 2 — Deeper Design */
    {
      title: "Thiết Kế Sâu Hơn",
      icon: "◈",
      content: (
        <div className="grid gap-3 sm:grid-cols-2">
          {p.IncarnationCross && <PropertyCard label="Thập Tự Kiếp" value={p.IncarnationCross.id} description={p.IncarnationCross.description} />}
          {p.Profile && <PropertyCard label="Profile" value={p.Profile.id} description={p.Profile.description} />}
          {p.Signature && <PropertyCard label="Chữ Ký" value={p.Signature.id} description={p.Signature.description} />}
          {p.NotSelfTheme && <PropertyCard label="Chủ Đề Không-Bản-Ngã" value={p.NotSelfTheme.id} description={p.NotSelfTheme.description} />}
        </div>
      ),
    },
    /* 3 — Energy Centers */
    ...(data.DefinedCenters?.length > 0 || data.OpenCenters?.length > 0
      ? [{
          title: "Các Trung Tâm Năng Lượng",
          icon: "⬡",
          content: (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-fuchsia-400">
                  Xác Định ({data.DefinedCenters.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.DefinedCenters.map(c => (
                    <span key={c}
                      className="rounded-full border border-fuchsia-500/30 bg-linear-to-r from-fuchsia-500/30 to-indigo-500/30 px-3 py-1 text-xs font-medium text-fuchsia-200">
                      {CENTER_LABELS[c] ?? c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Mở ({data.OpenCenters.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.OpenCenters.map(c => (
                    <span key={c}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
                      {CENTER_LABELS[c] ?? c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ),
        }]
      : []),
    /* 4 — Channels & Gates */
    ...((data.Channels?.length > 0 || data.Gates?.length > 0)
      ? [{
          title: "Kênh & Cổng",
          icon: "⌘",
          content: (
            <div className="flex flex-col gap-4">
              {data.Channels?.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Kênh ({data.Channels.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.Channels.map(ch => (
                      <span key={ch}
                        className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.Gates?.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Cổng ({data.Gates.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[...data.Gates].sort((a, b) => a - b).map(g => (
                      <span key={g}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-medium text-slate-300">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ),
        }]
      : []),
    /* 5 — Planetary Activations */
    ...(allPlanets.length > 0
      ? [{
          title: "Hành Tinh Kích Hoạt",
          icon: "☉",
          content: (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {/* header row */}
              <div className="grid grid-cols-[1.5rem_1fr_auto_auto] bg-white/5 text-[10px] font-bold uppercase tracking-wider">
                <div className="px-3 py-2.5" />
                <div className="px-3 py-2.5 text-slate-500">Hành Tinh</div>
                <div className="px-4 py-2.5 text-rose-400">Tính Cách</div>
                <div className="px-4 py-2.5 text-sky-400">Thiết Kế</div>
              </div>
              {allPlanets.map((pl, i) => {
                const pers = data.Personality?.[pl];
                const des  = data.Design?.[pl];
                return (
                  <div key={pl}
                    className={`grid grid-cols-[1.5rem_1fr_auto_auto] items-center ${
                      i % 2 === 0 ? "bg-white/2" : "bg-transparent"
                    }`}>
                    <div className="flex items-center justify-center py-2.5 text-base text-slate-500">
                      {PLANET_SYMBOLS[pl] ?? "·"}
                    </div>
                    <div className="py-2.5 pl-2 text-xs text-slate-200">{pl}</div>
                    <div className="py-2.5 pr-4 text-right text-xs font-mono text-rose-300">
                      {pers ? `${pers.Gate}.${pers.Line}` : "—"}
                    </div>
                    <div className="py-2.5 pr-4 text-right text-xs font-mono text-sky-300">
                      {des ? `${des.Gate}.${des.Line}` : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          ),
        }]
      : []),
    /* 6 — Variables */
    ...(data.Variables
      ? [{
          title: "Biến Số (Variables)",
          icon: "◎",
          content: (
            <div className="grid grid-cols-2 gap-3">
              <VariableArrow label="Tiêu Hóa"   direction={data.Variables.Digestion}   />
              <VariableArrow label="Môi Trường"  direction={data.Variables.Environment} />
              <VariableArrow label="Nhận Thức"   direction={data.Variables.Awareness}  />
              <VariableArrow label="Góc Nhìn"    direction={data.Variables.Perspective} />
            </div>
          ),
        }]
      : []),
  ];

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 text-slate-50">

      {/* type-color ambient glow (sits behind content, above layout's fixed blurs) */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b ${col.from}/15 to-transparent`} />
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t ${col.to}/8 to-transparent`} />

      <div className="relative w-full max-w-5xl space-y-8">

        {/* ── back ── */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tra cứu lại
        </button>

        {/* ── HERO INFO — centered ── */}
        <div className="text-center">
          {name && (
            <p className="mb-1 text-sm font-medium text-slate-400">Bản đồ năng lượng</p>
          )}
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg sm:text-5xl">
            {name || "Bản Đồ Năng Lượng"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sinh: <span className="font-semibold text-slate-200">{p.BirthDateLocal}</span>
            {p.Age != null && <span className="ml-2 text-slate-500">· {p.Age} tuổi</span>}
          </p>

          {/* badges */}
          {/* <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-bold ${col.badge}`}>
              {typeId}
            </span>
            {p.Profile?.id && (
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/8 px-3.5 py-1.5 text-xs font-semibold text-slate-200">
                Profile {p.Profile.id}
              </span>
            )}
            {p.Definition?.id && (
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/8 px-3.5 py-1.5 text-xs font-semibold text-slate-200">
                {p.Definition.id}
              </span>
            )}
          </div> */}

          {/* type pill */}
          {/* <div className={`mt-5 inline-flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-10 py-4 backdrop-blur-sm ${col.glow} shadow-xl`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Loại</p>
            <p className={`mt-1 bg-linear-to-br ${col.from} ${col.to} bg-clip-text text-2xl font-black text-transparent`}>
              {typeId}
            </p>
          </div> */}
        </div>

        {/* ── CAROUSEL (dots + footer rendered inside) ── */}
        <Carousel
          slides={slides}
          current={carouselCurrent}
          onCurrentChange={carouselGoTo}
          footer={<p className="text-xs text-slate-700">Dữ liệu được cung cấp bởi bodygraphchart.com</p>}
        />

      </div>
    </section>
  );
}
