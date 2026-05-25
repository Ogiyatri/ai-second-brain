# AI Second Brain — Backend

NestJS 11 REST API dengan arsitektur DDD. PostgreSQL + pgvector untuk vector similarity search, MinIO untuk object storage, OpenAI untuk embeddings dan chat.

## Menjalankan dengan Docker

Semua perintah dijalankan dari folder `build/docker/`.

### 1. Isi environment variables

```bash
cd build/docker
```

Edit `.env`, wajib diisi:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_here
```

### 2. Jalankan (Production)

```bash
cd build/docker
docker compose -f docker-compose.yml -f docker-compose.production.yml up -d
```

### 3. Jalankan (Development — hot reload)

```bash
cd build/docker
docker compose up -d
```

> Docker Compose otomatis merge `docker-compose.yml` + `docker-compose.override.yml` yang menggunakan `Dockerfile.dev` dengan volume mount source code.

---

## Akses Layanan

| Layanan       | URL                   | Keterangan                          |
|---------------|-----------------------|-------------------------------------|
| Backend API   | http://localhost:3001 |                                     |
| pgAdmin       | http://localhost:8081 | admin@admin.com / admin             |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin_secret      |

---

## Migrasi Database

Migrasi dijalankan **otomatis** saat container start.

Jika perlu dijalankan manual:

```bash
docker exec -it ai_second_brain_backend yarn migration:run
```

Revert migrasi:

```bash
docker exec -it ai_second_brain_backend yarn migration:revert
```

---

## Seeder

Set `SEED_ON_START=true` di `.env` untuk seed otomatis saat start, atau jalankan manual:

```bash
docker exec -it ai_second_brain_backend yarn seed
```

Akun yang dibuat:
- `admin@example.com` / `password123`
- `user@example.com` / `password123`

---

## Stop Container

```bash
cd build/docker
docker compose down

# Hapus data (volume) sekalian
docker compose down -v
```

---

## API Endpoints

| Method | Path                          | Auth | Keterangan              |
|--------|-------------------------------|------|-------------------------|
| POST   | /auth/register                | -    | Registrasi user baru    |
| POST   | /auth/login                   | -    | Login, dapat JWT token  |
| GET    | /auth/me                      | JWT  | Data user aktif         |
| POST   | /documents/upload             | JWT  | Upload file (PDF/DOCX/TXT) |
| GET    | /documents                    | JWT  | List dokumen user       |
| GET    | /documents/:id                | JWT  | Detail dokumen          |
| DELETE | /documents/:id                | JWT  | Hapus dokumen           |
| POST   | /ai/sessions                  | JWT  | Buat sesi chat baru     |
| GET    | /ai/sessions                  | JWT  | List sesi chat          |
| GET    | /ai/sessions/:id/messages     | JWT  | Pesan dalam sesi        |
| POST   | /ai/chat                      | JWT  | Kirim pesan ke AI       |
| POST   | /ai/generate                  | JWT  | Generate dokumen dengan AI |
