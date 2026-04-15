import HumanDesignForm from "./HumanDesignForm";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-50">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* ── LEFT : FORM ── */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-fuchsia-500/20 via-indigo-500/20 to-sky-500/20 blur-xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="mb-6 text-xl font-semibold uppercase text-white">
                Tra cứu bản đồ năng lượng
              </h3>
              <HumanDesignForm />
            </div>
          </div>

          {/* ── RIGHT : CONTENT ── */}
          <div className="text-center lg:text-left">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-fuchsia-300 via-indigo-200 to-sky-200 bg-clip-text text-transparent">
                Khám Phá Bản Đồ Năng Lượng Của Bạn
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Khám phá bản đồ năng lượng của bạn thông qua Human Design và Thần số học.
              Hiểu rõ cách bạn suy nghĩ, ra quyết định và vận hành trong cuộc sống.
            </p>
            <p className="mt-4 max-w-xl text-slate-400">
              Công cụ này giúp bạn nhìn thấy những tiềm năng bẩm sinh,
              con đường phù hợp và cách phát triển bản thân một cách tự nhiên nhất.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href="#Report"
                className="rounded-full bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Xem ví dụ báo cáo
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
