#!/usr/bin/env node

/**
 * Script to clone microservices for micro-store
 * Usage: npm run pull
 */

const fs = require("fs");
const path = require("path");
const spawn = require("cross-spawn");
const { promisify } = require("util");
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Read package.json to get services URLs
const packageJson = require("../package.json");
const servicesConfig = packageJson.services || {};

async function pullServices() {
  console.log("🚀 Pulling Micro Store microservices...");

  // Create services directory if it doesn't exist
  const servicesDir = path.join(__dirname, "..", "services");
  if (!(await existsAsync(servicesDir))) {
    await mkdirAsync(servicesDir, { recursive: true });
    console.log("📁 Created services directory");
  }

  // Clone or pull each microservice
  for (const [serviceName, serviceUrl] of Object.entries(servicesConfig)) {
    const serviceDir = path.join(servicesDir, serviceName);

    if (await existsAsync(serviceDir)) {
      console.log(
        `⏳ Updating ${serviceName} microservice from ${serviceUrl}...`
      );

      // Check if it's a git repository
      const gitDir = path.join(serviceDir, ".git");
      if (await existsAsync(gitDir)) {
        // Pull latest changes
        const pullResult = spawn.sync("git", ["pull"], {
          cwd: serviceDir,
          stdio: "inherit",
        });

        if (pullResult.status !== 0) {
          console.error(`❌ Failed to pull ${serviceName}`);
          process.exit(1);
        }
      } else {
        console.log(
          `⚠️  ${serviceName} directory exists but is not a git repository. Skipping...`
        );
      }
    } else {
      console.log(
        `⏳ Cloning ${serviceName} microservice from ${serviceUrl}...`
      );

      // Parse the URL to extract branch if specified
      let [repoUrl, branch] = serviceUrl.split("#");
      branch = branch || "main";

      // Clone the repository
      const cloneResult = spawn.sync(
        "git",
        ["clone", "--branch", branch, repoUrl, serviceDir],
        {
          stdio: "inherit",
        }
      );

      if (cloneResult.status !== 0) {
        console.error(`❌ Failed to clone ${serviceName}`);
        console.log(
          `💡 Make sure the repository ${repoUrl} exists and you have access to it`
        );
        continue; // Continue with other services instead of exiting
      }
    }

    console.log(`✅ Microservice ${serviceName} is ready`);
  }

  console.log("🎉 All microservices pulled successfully!");
  console.log("💡 You can now run 'npm run docker:up' to start all services");
}

pullServices().catch((err) => {
  console.error("❌ Error pulling microservices:", err);
  process.exit(1);
});
