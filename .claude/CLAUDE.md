# CLAUDE.md — VGTech MD Project Guide

## Tổng quan dự án

**Tên dự án**: VGTech MD — "Bản Đồ Năng Lượng" (Energy Map)  
**Mục đích**: Tra cứu biểu đồ Human Design và số học  
**Kiến trúc**: Laravel 12 (backend API) + Next.js 16 (frontend)  
**PHP**: 8.2+  
**Node.js**: Tương thích với Next.js 16 + Vite 7

---

## Cấu trúc thư mục

```
vgtechmd/
├── app/
│   ├── Http/Controllers/Api/   # API controllers (proxy tới bodygraphchart.com)
│   ├── Models/                  # Eloquent models
│   └── Providers/               # Service providers
├── database/
│   ├── migrations/              # Schema: users, cache, jobs
│   ├── factories/               # Model factories
│   └── seeders/
├── frontend/                    # Toàn bộ Next.js app (App Router)
│   ├── app/
│   │   ├── (user)/             # Trang người dùng
│   │   └── admin/              # Trang admin
│   └── components/
│       ├── admin/              # Header, Sidebar
│       ├── user/               # HeroSection, Form, Footer
│       └── pakage/             # Utilities dùng chung (lưu ý: tên thư mục là "pakage")
├── resources/
│   ├── css/app.css             # Tailwind v4 imports
│   ├── js/                     # Bootstrap Axios setup
│   └── views/                  # Blade templates (home.blade.php)
├── routes/
│   ├── web.php                 # Trang chủ + /api/health
│   └── api.php                 # /locations, /lookup
├── vite.config.js              # Vite chính (Laravel Blade + Tailwind)
└── vite.soft.config.js         # Vite riêng cho static assets (public/)
```

---

## Lệnh build & phát triển

### Backend (PHP/Laravel)

```bash
# Cài đặt toàn bộ (install, key, migrate, build frontend)
composer setup

# Chạy dev (Laravel server + queue + logs + Vite cùng lúc)
composer dev

# Chạy test PHPUnit
composer test

# Linter PHP
./vendor/bin/pint
```

### Frontend (Next.js — chạy trong thư mục frontend/)

```bash
cd frontend
npm run dev      # Dev server Next.js
npm run build    # Production build
npm run start    # Chạy production
npm run lint     # ESLint
```

### Asset Build (chạy ở root)

```bash
npm run dev          # Vite dev server (watch resources/ + Next.js frontend/)
npm run build        # Vite production build
npm run build:soft   # Build riêng dùng vite.soft.config.js (cho public/css, public/js)
```

---

## Cấu hình môi trường (.env)

| Biến | Mô tả |
|------|-------|
| `DB_CONNECTION` | `sqlite` (mặc định local), có thể đổi sang mysql/pgsql |
| `CACHE_STORE` | `database` (local), có thể dùng `redis` |
| `QUEUE_CONNECTION` | `database` |
| `SESSION_DRIVER` | `database` |
| `MAIL_MAILER` | `log` (local) |
| `BODYGRAPH_API_*` | Cấu hình API bên thứ 3 (bodygraphchart.com) |
| `SLACK_*` | Tích hợp Slack notification |

---

## Quy ước code

### PHP (Laravel)

- **Namespace**: `App\*` theo PSR-4
- **Controllers**: đặt trong `App\Http\Controllers\Api\` cho API
- **Models**: `App\Models\`
- **Kiểu PHP**: PHP 8 attributes, strict types
- **Linter**: Laravel Pint (`./vendor/bin/pint`)

### TypeScript/React (Next.js)

- **Strict mode** bật trong `tsconfig.json`
- **Routing**: App Router (Next.js 16) — dùng `app/` không phải `pages/`
- **Components**: functional components + hooks
- **Styling**: Tailwind CSS v4 (không dùng CSS modules)
- **Font**: Instrument Sans, Geist (cấu hình trong Tailwind theme)
- **Tên thư mục utilities**: `pakage/` (giữ đúng chính tả này — đã tồn tại)

---

## API Routes

| Method | Route | Mô tả |
|--------|-------|--------|
| GET | `/` | Trang chủ (Blade view) |
| GET | `/api/health` | Health check (DB + Redis) |
| GET/POST | `/api/locations` | Proxy → bodygraphchart.com |
| GET/POST | `/api/lookup` | Proxy → bodygraphchart.com |

---

## Database

- **Local**: SQLite tại `database/database.sqlite`
- **Migrations**: users, cache, jobs (chuẩn Laravel)
- **Chạy migration**: `php artisan migrate`
- **Refresh**: `php artisan migrate:fresh --seed`

---

## Tích hợp bên ngoài

- **Bodygraph API**: proxy qua `LocationController`, cấu hình qua `BODYGRAPH_API_*`
- **Redis**: qua Predis 3.4 (thay thế phpredis extension)
- **Slack**: notification, cấu hình qua `SLACK_*`

---

## Health Check

`GET /api/health` trả về:
```json
{
  "status": "ok",
  "version": "Laravel 12 / PHP 8.x",
  "database": "connected",
  "cache": "connected"
}
```

---

## Lưu ý quan trọng

- `frontend/AGENTS.md` — cảnh báo về sự khác biệt version Next.js, đọc trước khi chỉnh frontend
- `frontend/CLAUDE.md` — tham chiếu tới agents.md
- `.github/agents/` — chứa Claude agent config cho dự án
- Vite có **2 config riêng**: `vite.config.js` (chính) và `vite.soft.config.js` (static assets)
- Thư mục components dùng tên `pakage/` (không phải `package`) — **không đổi tên**
