import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../types/config.js";

async function writeFile(
  root: string,
  file: string,
  content: string
) {
  const destination = path.join(root, file);

  await fs.ensureDir(path.dirname(destination));

  await fs.writeFile(destination, content.trimStart());
}

export async function generateFiles(
  root: string,
  config: ProjectConfig
) {

  await writeFile(root, ".env.example", `
NODE_ENV=development
PORT=5000
${config.orm === "prisma"
      ? "DATABASE_URL=postgresql://postgres:password@localhost:5432/my_database?schema=public"
      : ""}
`);

  if (config.architecture === "modular") {

    await writeFile(root, "src/app.ts", `
import express from "express";
import { healthRouter } from "./modules/health/health.route.js";

export const app = express();

app.use(express.json());

${config.features.cors ? 'import cors from "cors";\napp.use(cors());' : ""}

${config.features.rateLimit
        ? 'import rateLimit from "express-rate-limit";\napp.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));'
        : ""}

${config.features.logger
        ? 'import pinoHttp from "pino-http";\napp.use(pinoHttp());'
        : ""}

app.use("/api/health", healthRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});
`);

    await writeFile(root, "src/modules/health/health.route.ts", `
import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});
`);

  } else {

    await writeFile(root, "src/server.ts", `
import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend is running"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
`);

  }

  await writeFile(root, "src/server.ts", `
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 5000);

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`);

  if (config.orm === "prisma") {

    await writeFile(root, "prisma/schema.prisma", `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`);

    await writeFile(root, "src/lib/prisma.ts", `
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
`);

  }

  if (config.features.validation) {
    await writeFile(root, "src/lib/env.ts", `
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000)
});

export const env = schema.parse(process.env);
`);
  }

  if (config.features.logger) {
    await writeFile(root, "src/lib/logger.ts", `
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info"
});
`);
  }

  if (config.features.docker) {
    await writeFile(root, "Dockerfile", `
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
`);
  }

  await writeFile(root, ".gitignore", `
node_modules
dist
.env
coverage
`);
}
