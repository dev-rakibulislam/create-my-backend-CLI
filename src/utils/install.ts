import { execa } from "execa";
import type { PackageManager } from "../types/config.js";

export async function installDependencies(
  cwd: string,
  packageManager: PackageManager
) {
  await execa(packageManager, ["install"], {
    cwd,
    stdio: "inherit"
  });
}
