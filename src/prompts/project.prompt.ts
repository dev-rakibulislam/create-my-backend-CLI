import * as p from "@clack/prompts";

import type { ProjectConfig } from "../types/config.js";

function handleCancel(value: unknown): void {
  if (p.isCancel(value)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }
}

export async function projectPrompt(
  projectName?: string,
  yes = false
): Promise<ProjectConfig> {
  const name = projectName ?? await p.text({
    message: "Project name?",
    placeholder: "my-api",
    defaultValue: "my-api",
    validate(value) {
      if (typeof value !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(value)) {
        return "Invalid project name";
      }
    },
  });

  handleCancel(name);

  const framework = yes
    ? "express"
    : await p.select({
      message: "Choose framework",
      options: [
        { value: "express", label: "Express" },
      ],
    });

  handleCancel(framework);

  const database = yes
    ? "postgresql"
    : await p.select({
      message: "Choose database",
      options: [
        { value: "postgresql", label: "PostgreSQL" },
        { value: "none", label: "No database" },
      ],
    });

  handleCancel(database);

  const orm = yes
    ? database === "postgresql" ? "prisma" : "none"
    : await p.select({
      message: "Choose ORM",
      options: [
        { value: "prisma", label: "Prisma" },
        { value: "none", label: "None" },
      ],
    });

  handleCancel(orm);

  const architecture = yes
    ? "modular"
    : await p.select({
      message: "Choose architecture",
      options: [
        { value: "modular", label: "Modular architecture" },
        { value: "minimal", label: "Minimal architecture" },
      ],
    });

  handleCancel(architecture);

  const selectedFeatures = yes
    ? ["validation", "logger", "cors", "rateLimit", "testing"]
    : await p.multiselect({
      message: "Select features",
      required: false,
      options: [
        { value: "validation", label: "Zod validation" },
        { value: "logger", label: "Pino logger" },
        { value: "cors", label: "CORS" },
        { value: "rateLimit", label: "Rate limiter" },
        { value: "docker", label: "Docker" },
        { value: "testing", label: "Vitest" },
      ],
    });

  handleCancel(selectedFeatures);

  // TypeScript narrowing
  if (!Array.isArray(selectedFeatures)) {
    throw new Error("Invalid feature selection");
  }

  const packageManager = yes
    ? "bun"
    : await p.select({
      message: "Package manager",
      options: [
        { value: "bun", label: "Bun" },
        { value: "npm", label: "npm" },
        { value: "pnpm", label: "pnpm" },
        { value: "yarn", label: "yarn" },
      ],
    });

  handleCancel(packageManager);

  if (database === "none" && orm !== "none") {
    throw new Error("ORM requires a database");
  }

  return {
    name: String(name),
    framework: "express",
    database: database as ProjectConfig["database"],
    orm: orm as ProjectConfig["orm"],
    architecture: architecture as ProjectConfig["architecture"],
    packageManager: packageManager as ProjectConfig["packageManager"],

    features: {
      validation: selectedFeatures.includes("validation"),
      logger: selectedFeatures.includes("logger"),
      cors: selectedFeatures.includes("cors"),
      rateLimit: selectedFeatures.includes("rateLimit"),
      docker: selectedFeatures.includes("docker"),
      testing: selectedFeatures.includes("testing"),
    },
  };
}
