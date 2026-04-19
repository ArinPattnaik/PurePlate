# PurePlate — India's Food Transparency Platform

<p align="center">
  <strong>🍃 Decode the truth behind Indian packaged food.</strong>
</p>

PurePlate is a full-stack algorithmic transparency platform that analyzes the ingredients of Indian FMCG products. It identifies hidden chemicals, INS additives, deceptive sugars, and low-quality fillers — providing consumers with a clear **Transparency Score** for every item.

## 🚀 Key Features

- **325+ Indian Products Indexed** — Covering global and local brands like Maggi, Amul, Haldiram's, Nestle, Cadbury, and more.
- **60+ Chemical Additives Tracked** — Comprehensive INS code dictionary with risk-level assessments (High/Moderate/Low).
- **Algorithmic Grading (1-10)** — Real-time scoring based on ingredient quality, chemical load, and greenwashing tactics.
- **AI-Powered Search Expansion** — Integrated with Gemini to analyze products not yet in the database.
- **Responsive Web Interface** — High-performance UI built with Next.js and Tailwind CSS.
- **Dockerized Database** — Robust PostgreSQL backend managed via Prisma ORM.

## 🏗️ Architecture

- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion.
- **Backend**: Node.js/Express API (TypeScript).
- **Database**: PostgreSQL (Prisma ORM).
- **Environment**: Containerized PostgreSQL via Docker Compose.

## 🛠️ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL)

### 1. Database Setup
Spin up the PostgreSQL container and seed the data:
```bash
cd backend
docker-compose up -d
npm install
npx prisma db push
npm run seed
```

### 2. Backend Setup
Start the Express API server:
```bash
# Inside the /backend directory
npm run dev
```

### 3. Frontend Setup
Start the Next.js development server:
```bash
cd ..
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform.

## 🔑 Environment Variables

### Frontend (.env.local)
- `GEMINI_API_KEY`: Your Google AI Studio key for search augmentation.
- `BACKEND_URL`: URL of the Express backend (default: http://localhost:5000).

### Backend (.env)
- `DATABASE_URL`: Connection string for PostgreSQL.
- `PORT`: API port (default: 5000).

## 📄 License
MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <em>Built for Food Transparency. Powered by Data Intelligence.</em>
</p>
