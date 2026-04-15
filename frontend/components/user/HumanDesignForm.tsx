"use client";

import { useState, useEffect, useRef } from "react";
import { ErrorMsg } from "@/components/pakage/ErrorMsg";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
interface FormData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  birthPlaceTimezone: string;
  timeZone: string;
  countryName: string;
}

type FieldErrors = Partial<Record<keyof FormData, string>>;

interface SubmitState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

interface LocationResult {
  value: string;
  asciiname: string;
  admin1: string;
  country: string;
  timezone: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
const MONTHS_VI = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];
const DAYS_VI = ["CN","T2","T3","T4","T5","T6","T7"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}
function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}
function parseISO(iso: string): { y: number; m: number; d: number } | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}

/* ------------------------------------------------------------------ */
/* DatePicker                                                           */
/* ------------------------------------------------------------------ */
function DatePicker({
  value,
  hasError,
  onChange,
  onBlur,
}: {
  value: string;
  hasError: boolean;
  onChange: (iso: string) => void;
  onBlur?: () => void;
}) {
  const today = new Date();
  const parsed = parseISO(value);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.y ?? today.getFullYear() - 20);
  const [viewMonth, setViewMonth] = useState(parsed?.m ?? today.getMonth());
  const [mode, setMode] = useState<"day" | "month" | "year">("day");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);

  // Giữ openRef đồng bộ với state open
  useEffect(() => { openRef.current = open; }, [open]);

  // Sync view khi value thay đổi từ ngoài
  useEffect(() => {
    if (parsed) { setViewYear(parsed.y); setViewMonth(parsed.m); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        // Chỉ mark touched khi popup đang mở — tránh trigger lỗi khi chưa tương tác
        if (openRef.current) {
          setOpen(false);
          onBlur?.();
        }
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [onBlur]);

  function selectDay(d: number) {
    onChange(toISO(viewYear, viewMonth, d));
    setOpen(false);
    onBlur?.();
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Tạo các ô ngày
  const totalDays = daysInMonth(viewYear, viewMonth);
  const firstDay = firstDayOfMonth(viewYear, viewMonth); // 0=Sun
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad cuối cho đủ hàng
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (d: number) =>
    parsed?.y === viewYear && parsed?.m === viewMonth && parsed?.d === d;
  const isToday = (d: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d;
  const isFuture = (d: number) =>
    new Date(toISO(viewYear, viewMonth, d)) > today;

  const displayValue = parsed
    ? `${String(parsed.d).padStart(2,"0")}/${String(parsed.m + 1).padStart(2,"0")}/${parsed.y}`
    : "";

  const borderClass = hasError
    ? "border-red-400/60"
    : "border-white/10 focus:border-fuchsia-400/60";

  /* Year range: 1900 → năm hiện tại */
  const yearRange = Array.from(
    { length: today.getFullYear() - 1900 + 1 },
    (_, i) => today.getFullYear() - i
  );

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen(v => !v); setMode("day"); }}
        className={`flex w-full h-11 items-center justify-between rounded-xl border bg-white/5
          px-4 text-left transition-colors focus:outline-none focus:ring-2
          focus:ring-fuchsia-400/20 ${borderClass}`}
      >
        <span className={displayValue ? "text-sm text-white" : "text-sm text-slate-500"}>
          {displayValue || "DD/MM/YYYY"}
        </span>
        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-2xl border border-white/10
          bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden">

          {/* ---- Day view ---- */}
          {mode === "day" && (
            <>
              {/* Header */}
<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
  <button type="button" onClick={prevMonth}
    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>

  <div className="flex items-center gap-1">
    <button
      type="button"
      onClick={() => setMode("month")}
      className="rounded-lg px-2 py-1 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
    >
      {MONTHS_VI[viewMonth]}
    </button>
    <button
      type="button"
      onClick={() => setMode("year")}
      className="rounded-lg px-1 py-1 text-sm font-bold text-fuchsia-400 hover:text-fuchsia-300 hover:bg-white/10 transition-colors"
    >
      {viewYear}
    </button>
  </div>

  <button type="button" onClick={nextMonth}
    disabled={viewYear === today.getFullYear() && viewMonth >= today.getMonth()}
    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>

              {/* Day labels */}
              <div className="grid grid-cols-7 px-3 pt-2">
                {DAYS_VI.map(d => (
                  <div key={d} className="flex h-8 items-center justify-center text-xs font-medium text-slate-500">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-y-0.5 px-3 pb-3">
                {cells.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const selected = isSelected(d);
                  const todayMark = isToday(d);
                  const future = isFuture(d);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={future}
                      onClick={() => selectDay(d)}
                      className={`relative flex h-8 w-8 mx-auto items-center justify-center rounded-full text-sm transition-all
                        ${future ? "text-slate-700 cursor-not-allowed" : "hover:bg-white/10 cursor-pointer"}
                        ${selected ? "bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white font-semibold shadow-lg shadow-fuchsia-500/30" : "text-slate-200"}
                        ${todayMark && !selected ? "text-fuchsia-400 font-semibold" : ""}
                      `}
                    >
                      {d}
                      {todayMark && !selected && (
                        <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-fuchsia-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ---- Month view ---- */}
          {mode === "month" && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-sm font-semibold text-white">Chọn tháng</span>
                <button type="button" onClick={() => setMode("day")}
                  className="text-xs text-slate-400 hover:text-white transition-colors">✕</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS_VI.map((name, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setViewMonth(idx); setMode("day"); }}
                    className={`rounded-xl py-2 text-xs font-medium transition-all
                      ${viewMonth === idx
                        ? "bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- Year view ---- */}
          {mode === "year" && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-sm font-semibold text-white">Chọn năm</span>
                <button type="button" onClick={() => setMode("day")}
                  className="text-xs text-slate-400 hover:text-white transition-colors">✕</button>
              </div>
              <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
                {yearRange.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => { setViewYear(y); setMode("day"); }}
                    className={`rounded-lg py-1.5 text-xs font-medium transition-all
                      ${viewYear === y
                        ? "bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Validation rules                                                     */
/* ------------------------------------------------------------------ */
function validateForm(data: FormData): FieldErrors {
  const errors: FieldErrors = {};

  const name = data.fullName.trim();
  if (!name) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  } else if (name.length < 2) {
    errors.fullName = "Họ và tên phải có ít nhất 2 ký tự.";
  } else if (name.length > 60) {
    errors.fullName = "Họ và tên không được quá 60 ký tự.";
  } else if (/[0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(name)) {
    errors.fullName = "Họ và tên không được chứa số hoặc ký tự đặc biệt.";
  }

  if (!data.birthDate) {
    errors.birthDate = "Vui lòng chọn ngày sinh.";
  } else {
    const birth = new Date(data.birthDate);
    const today = new Date(); today.setHours(0,0,0,0);
    if (isNaN(birth.getTime())) errors.birthDate = "Ngày sinh không hợp lệ.";
    else if (birth > today) errors.birthDate = "Ngày sinh không thể ở tương lai.";
    else if (birth < new Date("1900-01-01")) errors.birthDate = "Ngày sinh không hợp lệ (trước năm 1900).";
  }

  if (data.birthTime) {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.birthTime))
      errors.birthTime = "Giờ sinh không hợp lệ.";
  }

  if (!data.birthPlace) errors.birthPlace = "Vui lòng chọn nơi sinh.";

  return errors;
}

/* ------------------------------------------------------------------ */
/* LocationPicker                                                       */
/* ------------------------------------------------------------------ */
function LocationPicker({
  value, hasError, onChange,
}: {
  value: string;
  hasError: boolean;
  onChange: (loc: LocationResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults([]); setSearching(false); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/locations?query=${encodeURIComponent(query)}`
        );
        setResults(await res.json());
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 300);
  }, [query]);

  function handleSelect(loc: LocationResult) {
    onChange(loc); setOpen(false); setQuery(""); setResults([]);
  }

  const borderClass = hasError
    ? "border-red-400/60"
    : "border-white/10 focus:border-fuchsia-400/60";

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" onClick={() => setOpen(v => !v)}
        className={`flex w-full h-11 items-center justify-between rounded-xl border bg-white/5
          px-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20 ${borderClass}`}>
        <span className={value ? "text-sm text-white" : "text-sm text-slate-500"}>
          {value || "Chọn nơi sinh"}
        </span>
        <svg className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[300px] rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
          <div className="border-b border-white/10 p-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input ref={searchRef} type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Tìm thành phố..."
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-8 text-sm
                  text-white placeholder:text-slate-500 focus:border-fuchsia-400/60 focus:outline-none" />
              {searching && (
                <svg className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400"
                  fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {results.length === 0 && !searching && (
              <li className="px-4 py-3 text-sm text-slate-500">
                {query.length < 2 ? "Nhập ít nhất 2 ký tự để tìm kiếm" : "Không tìm thấy kết quả"}
              </li>
            )}
            {results.map((loc, i) => (
              <li key={i}>
                <button type="button" onMouseDown={() => handleSelect(loc)}
                  className="flex w-full flex-col px-4 py-2.5 text-left transition-colors hover:bg-white/10">
                  <span className="text-sm font-medium text-white">{loc.asciiname}</span>
                  <span className="text-xs text-slate-400">
                    {[loc.admin1, loc.country].filter(Boolean).join(", ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main form                                                            */
/* ------------------------------------------------------------------ */
export default function HumanDesignForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    birthDate: "",
    birthTime: "00:00",
    birthPlace: "",
    birthPlaceTimezone: "",
    timeZone: "Asia/Ho_Chi_Minh",
    countryName: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ loading: false, success: false, error: null });

    useEffect(() => {
        const newErrors = validateForm(formData);
        const filtered: FieldErrors = {};

        // Chỉ giữ lại lỗi của các field đã được touch
        (Object.keys(newErrors) as (keyof FormData)[]).forEach(k => {
            if (touched[k]) {
            filtered[k] = newErrors[k];
            }
        });

        setErrors(filtered);
    }, [formData, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { fullName: true, birthDate: true, birthTime: true, birthPlace: true };
    setTouched(allTouched);
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSubmitState({ loading: true, success: false, error: null });
    try {
      await new Promise(r => setTimeout(r, 1000));
      setSubmitState({ loading: false, success: true, error: null });
    } catch (err) {
      setSubmitState({ loading: false, success: false, error: err instanceof Error ? err.message : "Có lỗi xảy ra." });
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full h-11 rounded-xl border bg-white/5 px-4 text-sm text-white placeholder:text-slate-500
    focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? "border-red-400/60 focus:ring-red-400/20"
        : "border-white/10 focus:border-fuchsia-400/60 focus:ring-fuchsia-400/20"
    }`;

  if (submitState.success) {
    return (
      <div className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-6 py-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-500/20">
          <svg className="h-6 w-6 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold text-white">Đã nhận thông tin!</p>
        <p className="mt-1 text-sm text-slate-300">Bản đồ năng lượng của bạn đang được xử lý.</p>
        <button
          onClick={() => {
            setSubmitState({ loading: false, success: false, error: null });
            setFormData({ fullName: "", birthDate: "", birthTime: "00:00", birthPlace: "", birthPlaceTimezone: "", timeZone: "Asia/Ho_Chi_Minh", countryName: "" });
            setErrors({}); setTouched({});
          }}
          className="mt-4 text-sm text-fuchsia-300 hover:text-fuchsia-200 underline"
        >
          Tra cứu lại
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <input type="hidden" name="timeZone" id="timeZone" value={formData.timeZone} />
        <input type="hidden" name="countryName" id="countryName" value={formData.countryName} />
      </div>

      {/* Họ và tên */}
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-300">
          Họ và tên <span className="text-red-400">*</span>
        </label>
        <input
          id="fullName" name="fullName" type="text"
          autoComplete="name" placeholder="Nguyễn Văn A"
          value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
          className={inputClass("fullName")}
        />
        <ErrorMsg msg={errors.fullName} />
      </div>

      {/* Ngày sinh */}
    <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Ngày sinh <span className="text-red-400">*</span>
        </label>
        <DatePicker
            value={formData.birthDate}
            hasError={!!errors.birthDate}
            onChange={iso => {
            setFormData(prev => ({ ...prev, birthDate: iso }));
            }}
            onBlur={() => setTouched(prev => ({ ...prev, birthDate: true }))}
        />
        {touched.birthDate && <ErrorMsg msg={errors.birthDate} />}
    </div>

      {/* Giờ sinh + Nơi sinh */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="birthTime" className="mb-1.5 block text-sm font-medium text-slate-300">
            Giờ sinh
            <span className="ml-1 text-xs text-slate-500">(không bắt buộc)</span>
          </label>
          <input
            id="birthTime" name="birthTime" type="time"
            value={formData.birthTime} onChange={handleChange} onBlur={handleBlur}
            className={`${inputClass("birthTime")} [color-scheme:dark]`}
          />
          <ErrorMsg msg={errors.birthTime} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Nơi sinh <span className="text-red-400">*</span>
          </label>
          <LocationPicker
            value={formData.birthPlace}
            hasError={!!errors.birthPlace}
            onChange={loc => {
              setFormData(prev => ({
                ...prev,
                birthPlace: loc.value,
                birthPlaceTimezone: loc.timezone,
                timeZone: loc.timezone,
                countryName: loc.country,
              }));
              setTouched(prev => ({ ...prev, birthPlace: true }));
            }}
          />
          <ErrorMsg msg={errors.birthPlace} />
        </div>
      </div>

      {submitState.error && (
        <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
          {submitState.error}
        </p>
      )}

    <button
        type="submit" disabled={submitState.loading}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500
          px-6 py-3 font-semibold text-white transition-all
          hover:from-fuchsia-600 hover:to-indigo-600 hover:shadow-lg hover:shadow-fuchsia-500/25
          disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitState.loading ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang xử lý…
            </span>
        ) : (
            <span className="flex items-center justify-center gap-2">
                Tra cứu bản đồ năng lượng
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </span>
        )}
      </button>

      <p className="text-center text-xs text-slate-500">
        Toàn bộ thông tin của bạn sẽ được bảo mật.
      </p>
    </form>
  );
}
