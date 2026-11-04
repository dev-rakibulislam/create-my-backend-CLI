export type Framework = "express";

export type Database = "postgresql" | "none";

export type ORM = "prisma" | "none";

export type Architecture = "modular" | "minimal";

export type PackageManager =
  | "npm"
  | "pnpm"
  | "yarn"
  | "bun";
  
export interface ProjectConfig {
  name: string;
  framework: Framework;
  database: Database;
  orm: ORM;
  architecture: Architecture;
  packageManager: PackageManager;

  features: {
    validation: boolean;
    logger: boolean;
    cors: boolean;
    rateLimit: boolean;
    docker: boolean;
    testing: boolean;
  };
}
