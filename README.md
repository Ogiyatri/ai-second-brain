# AI Second Brain

Full-stack AI-powered second brain application. Backend: NestJS + PostgreSQL (pgvector) + MinIO. Frontend: Next.js 14.

## Struktur Project

```
ai-second-brain/
├── backend/
│   └── build/docker/          # Docker files backend
│       ├── .env               # Environment variables
│       ├── docker-compose.yml
│       ├── docker-compose.override.yml   # Dev mode (auto-merge, pakai Dockerfile.dev)
│       ├── docker-compose.production.yml # Production (pakai Dockerfile)
│       ├── Dockerfile         # Production image
│       └── Dockerfile.dev     # Development image (hot reload)
└── frontend/
    └── build/docker/          # Docker files frontend
        ├── .env
        ├── docker-compose.yml
        ├── docker-compose.production.yml
        ├── Dockerfile         # Production image
        └── Dockerfile.dev     # Development image
```

---

## Persiapan

### 1. Isi environment variables backend

```bash
cd backend/build/docker
```

Edit file `.env` dan ganti nilai berikut:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx   # wajib diisi
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_here
```

Nilai lainnya sudah terisi default dan siap pakai.

### 2. Isi environment variables frontend

```bash
cd frontend/build/docker
```

File `.env` sudah berisi:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Menjalankan dengan Docker (Production)

> Jalankan masing-masing dari dalam folder `build/docker`-nya.

### Backend

```bash
cd backend/build/docker
docker compose -f docker-compose.yml -f docker-compose.production.yml up -d
```

### Frontend

```bash
cd frontend/build/docker
docker compose -f docker-compose.yml -f docker-compose.production.yml up -d
```

> **Catatan**: Jalankan backend terlebih dahulu karena frontend butuh backend sudah berjalan.

---

## Menjalankan dengan Docker (Development / Hot Reload)

Mode ini menggunakan `Dockerfile.dev` dengan volume mount source code sehingga perubahan file langsung ter-reflect tanpa rebuild image.

### Backend

```bash
cd backend/build/docker
docker compose up -d
```

_(Docker Compose otomatis merge `docker-compose.yml` + `docker-compose.override.yml` yang menggunakan `Dockerfile.dev`)_

### Frontend

```bash
cd frontend/build/docker
docker compose up -d
```

---

## Akses Layanan

| Layanan        | URL                            | Keterangan                     |
|----------------|--------------------------------|--------------------------------|
| Backend API    | http://localhost:3001          |                                |
| Frontend       | http://localhost:3000          |                                |
| pgAdmin        | http://localhost:8081          | user: admin@admin.com / admin  |
| MinIO Console  | http://localhost:9001          | user: minioadmin / minioadmin_secret |

---

## Migrasi Database

Migrasi dijalankan **otomatis** saat backend container start. Tidak perlu langkah manual.

Jika ingin menjalankan migrasi secara manual dari dalam container:

```bash
docker exec -it ai_second_brain_backend yarn migration:run
```

---

## Seeder (Data Dummy)

Untuk mengisi data awal (2 user demo), set `SEED_ON_START=true` di `backend/build/docker/.env` sebelum menjalankan container.

Atau jalankan manual:

```bash
docker exec -it ai_second_brain_backend yarn seed
```

Akun yang dibuat:
- `admin@example.com` / `password123`
- `user@example.com` / `password123`

---

## Stop Container

```bash
# Backend
cd backend/build/docker
docker compose down

# Frontend
cd frontend/build/docker
docker compose down
```

Untuk menghapus data (volume) sekalian:

```bash
docker compose down -v
```
