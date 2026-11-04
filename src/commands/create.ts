import fs from "fs-extra";
import path from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";

import { projectPrompt } from "../prompts/project.prompt.js";
import { generateProject } from "../generators/project.generator.js";
import { installDependencies } from "../utils/install.js";

interface Options {
  yes?: boolean;
  skipInstall?: boolean;
}

export async function createProject(
  projectName: string | undefined,
  options: Options
) {

  p.intro(pc.bgCyan(pc.black(" create-my-backend ")));

  const config = await projectPrompt(
    projectName,
    options.yes
  );

  const root = path.resolve(process.cwd(), config.name);

  if (await fs.pathExists(root)) {
    const overwrite = await p.confirm({
      message: "Directory already exists. Continue?"
    });

    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel("Cancelled");
      return;
    }

    throw new Error(
      "Target directory already exists. Choose a new project name to avoid overwriting existing files."
    );
  }

  const spinner = p.spinner();

  spinner.start("Generating project");

  await generateProject(config);

  spinner.stop("Project generated");

  if (!options.skipInstall) {
    spinner.start("Installing dependencies");

    try {
      await installDependencies(
        root,
        config.packageManager
      );

      spinner.stop("Dependencies installed");
    } catch (error) {
      spinner.stop("Installation failed");
      console.error(error);
      console.log("Run install manually inside the project.");
    }
  }

  p.outro(pc.green("Your backend is ready!"));

  console.log(`
  cd ${config.name}
  ${config.packageManager} run dev
  `);
}
