@echo off
npm install --no-audit --no-fund --loglevel=info -D typescript @types/node @types/express @types/cors ts-node prisma
npx prisma db push
npx ts-node seed.ts
