#!/usr/bin/env bun

import { Command } from "commander";
import pc from "picocolors";
import { createProject } from "./commands/create.js";

const program = new Command();

program
  .name("create-my-backend")
  .description("Create a backend project")
  .version("0.1.0")
  .argument("[project-name]", "Project name")
  .option("-y, --yes", "Use default configuration")
  .option("--skip-install", "Skip dependency installation")
  .action(async (projectName, options) => {
    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error(pc.red("Failed to create project"));

      console.error(
        error instanceof Error ? error.message : error
      );

      process.exitCode = 1;
    }
  });

program.parse();
