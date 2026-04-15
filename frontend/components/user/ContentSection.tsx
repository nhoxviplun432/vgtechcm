import Link from "next/link";

// Mẫu nội dung — sẽ được thay bằng dữ liệu từ Laravel API
const ARTICLE_CONTENT = `
<h2>Human Design là gì?</h2>
<p>
  Human Design là hệ thống tổng hợp độc đáo từ Kinh Dịch, Astrology, Kabbalah và Chakra —
  giúp bạn hiểu cơ chế hoạt động bẩm sinh của chính mình. Không phải để "đoán số",
  mà để <strong>sống đúng cơ chế</strong>.
</p>
<h2>Thần số học ứng dụng thực tế</h2>
<p>
  Thần số học không phải là dự đoán tương lai — mà là ngôn ngữ cảm xúc.
  Mỗi con số mang một tần số riêng, phản ánh chu kỳ và bài học bạn đang trải qua.
</p>
<blockquote>
  Khi bạn hiểu mình đang ở chu kỳ nào, bạn sẽ ngừng đấu tranh với bản thân
  và bắt đầu hợp tác với năng lượng của mình.
</blockquote>
<h2>Tại sao nên kết hợp cả hai?</h2>
<p>
  Human Design cho bạn thấy <em>cơ chế ra quyết định</em> tự nhiên nhất.
  Thần số học cho bạn thấy <em>nhịp điệu thời gian</em> bạn đang sống.
  Kết hợp hai hệ thống này tạo ra một bản đồ toàn diện — cá nhân hóa đến từng chi tiết.
</p>
`;

const CHIPS = ["Human Design", "Thần số học", "Ứng dụng thực tế"] as const;

const FEATURE_CARDS = [
    {
        label: "THẦN SỐ HỌC",
        title: "Giải mã nhịp điệu cuộc đời",
        desc: 'Nhìn vào "con số" như một ngôn ngữ cảm xúc, để hiểu mình đang học bài học gì.',
    },
    {
        label: "HUMAN DESIGN",
        title: "Tối ưu năng lượng tự nhiên",
        desc: 'Khi bạn "đúng cơ chế", mọi thứ bớt gồng và kết quả đến nhẹ hơn.',
    },
    {
        label: "THỰC HÀNH",
        title: "Một bước nhỏ mỗi ngày",
        desc: "Chọn 1 thói quen phù hợp với tần số của bạn và làm đều 7 ngày.",
    },
] as const;

export default function ContentSection() {
  return (
    <section id="description" className="relative bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-12">

          {/* ── MAIN CONTENT ── */}
          <main className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <div className="p-6 sm:p-8">

                {/* Chips */}
                <div className="flex flex-wrap gap-2">
                  {CHIPS.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700
                        dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Article prose */}
                <article
                  className="prose prose-slate mt-6 max-w-none
                    prose-headings:scroll-mt-24
                    prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-fuchsia-400
                    prose-hr:border-slate-200
                    dark:prose-invert dark:prose-hr:border-white/10"
                  dangerouslySetInnerHTML={{ __html: ARTICLE_CONTENT }}
                />

                {/* Feature cards */}
                <div className="mt-10 border-t border-slate-200 pt-6 dark:border-white/10">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {FEATURE_CARDS.map(({ label, title, desc }) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5
                          dark:border-white/10 dark:bg-white/5"
                      >
                        <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300/70">
                          {label}
                        </p>
                        <p className="mt-2 text-sm font-semibold">{title}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-200/80">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA inline */}
                <div
                  id="ket-noi"
                  className="mt-10 rounded-2xl border border-slate-200
                    bg-gradient-to-r from-fuchsia-50 via-white to-indigo-50 p-6
                    dark:border-white/10 dark:from-white/5 dark:via-white/5 dark:to-white/5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold">Muốn mình đọc giúp bản đồ của bạn?</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-200/80">
                        Gửi thông tin cơ bản, mình sẽ gợi ý hướng ứng dụng phù hợp nhất.
                      </p>
                    </div>
                    <Link
                      href="/lien-he"
                      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white
                        hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100
                        whitespace-nowrap transition-colors"
                    >
                      Kết nối ngay
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </main>

          {/* ── SIDEBAR ── */}
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">

              {/* TOC */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <p className="text-sm font-semibold">Điểm chạm trong trang</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-200/80">
                  Nếu bài dài, bạn có thể chia section bằng H2/H3. Mình có thể thêm script tạo TOC tự động.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { href: "#noi-dung", label: "Nội dung" },
                    { href: "#ket-noi",  label: "Tư vấn"  },
                  ].map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700
                        hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10
                        transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Energy card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300/70">
                  NĂNG LƯỢNG HÔM NAY
                </p>
                <p className="mt-2 text-lg font-semibold">Tập trung vào điều cốt lõi</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-200/80">
                  Trước khi tìm câu trả lời lớn, hãy chọn một việc nhỏ làm đúng cơ chế của bạn.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: "Tần số", value: "Ổn định" },
                    { label: "Nhịp",   value: "Chậm mà chắc" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center
                        dark:border-white/10 dark:bg-white/5"
                    >
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-300/70">{label}</p>
                      <p className="mt-1 text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA sidebar */}
              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm dark:border-white/10">
                <p className="text-sm font-semibold">Nhận bản đọc cá nhân hoá</p>
                <p className="mt-2 text-sm text-white/80">
                  Dành cho người muốn hiểu mình rõ hơn và có hướng đi cụ thể trong 7–14 ngày.
                </p>
                <Link
                  href="/san-pham"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-2.5
                    text-sm font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
                >
                  Xem gói tư vấn
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}
