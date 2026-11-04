import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../types/config.js";

import { generatePackageJson } from "./package.generator.js";
import { generateFiles } from "./files.generator.js";

export async function generateProject(
  config: ProjectConfig
) {

  const root = path.resolve(process.cwd(), config.name);

  await fs.ensureDir(root);

  await fs.writeJson(
    path.join(root, "package.json"),
    generatePackageJson(config),
    { spaces: 2 }
  );

  await fs.writeJson(
    path.join(root, "tsconfig.json"),
    {
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        rootDir: "src",
        outDir: "dist",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true
      },
      include: ["src"]
    },
    { spaces: 2 }
  );

  await generateFiles(root, config);

  return root;
}
