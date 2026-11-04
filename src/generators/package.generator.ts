import type { ProjectConfig } from "../types/config.js";

export function generatePackageJson(config: ProjectConfig) {
  const dependencies: Record<string, string> = {
    express: "^5.1.0",
    dotenv: "^16.4.7",
  };

  const devDependencies: Record<string, string> = {
    "@types/express": "^5.0.1",
    "@types/node": "^22.15.0",
    typescript: "^5.8.3",
    tsx: "^4.19.0",
  };

  // Validation
  if (config.features.validation) {
    dependencies.zod = "^3.24.2";
  }

  // Logger
  if (config.features.logger) {
    dependencies.pino = "^9.6.0";
    dependencies["pino-http"] = "^10.4.0";
    devDependencies["pino-pretty"] = "^13.0.0";
  }

  // CORS
  if (config.features.cors) {
    dependencies.cors = "^2.8.5";
    devDependencies["@types/cors"] = "^2.8.17";
  }

  // Rate limiter
  if (config.features.rateLimit) {
    dependencies["express-rate-limit"] = "^7.5.0";
  }

  // Prisma
  if (config.orm === "prisma") {
    dependencies["@prisma/client"] = "^6.6.0";
    devDependencies.prisma = "^6.6.0";
  }

  // Testing
  if (config.features.testing) {
    devDependencies.vitest = "^3.1.0";
  }

  const scripts: Record<string, string> = {
    dev:
      config.packageManager === "bun"
        ? "bun --watch src/server.ts"
        : "tsx watch src/server.ts",

    build: "tsc",
    start: "node dist/server.js",
    typecheck: "tsc --noEmit",
  };

  if (config.features.testing) {
    scripts.test = "vitest run";
  }

  if (config.orm === "prisma") {
    scripts["db:generate"] = "prisma generate";
    scripts["db:migrate"] = "prisma migrate dev";
  }

  return {
    name: config.name,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts,
    dependencies,
    devDependencies,
  };
}
