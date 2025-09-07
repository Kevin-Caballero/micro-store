#!/usr/bin/env node

/**
 * Script to prepare all microservices (install dependencies and build)
 * Usage: npm run prepare
 */

const fs = require("fs");
const path = require("path");
const spawn = require("cross-spawn");
const { promisify } = require("util");
const existsAsync = promisify(fs.exists);

// Read package.json to get services configuration
const packageJson = require("../package.json");
const servicesConfig = packageJson.services || {};

async function prepareServices() {
  console.log("🔧 Preparing Micro Store microservices...");

  const servicesDir = path.join(__dirname, "..", "services");

  // Check if services directory exists
  if (!(await existsAsync(servicesDir))) {
    console.error(
      "❌ Services directory not found. Please run 'npm run pull' first."
    );
    process.exit(1);
  }

  // Prepare each microservice
  for (const serviceName of Object.keys(servicesConfig)) {
    const serviceDir = path.join(servicesDir, serviceName);

    if (!(await existsAsync(serviceDir))) {
      console.log(`⚠️  Service ${serviceName} not found. Skipping...`);
      continue;
    }

    const packageJsonPath = path.join(serviceDir, "package.json");
    if (!(await existsAsync(packageJsonPath))) {
      console.log(`⚠️  package.json not found in ${serviceName}. Skipping...`);
      continue;
    }

    console.log(`📦 Installing dependencies for ${serviceName}...`);

    // Install dependencies
    const installResult = spawn.sync("npm", ["install"], {
      cwd: serviceDir,
      stdio: "inherit",
    });

    if (installResult.status !== 0) {
      console.error(`❌ Failed to install dependencies for ${serviceName}`);
      process.exit(1);
    }

    // Check if Prisma schema exists and generate client if needed
    const prismaSchemaPath = path.join(serviceDir, "prisma", "schema.prisma");
    if (await existsAsync(prismaSchemaPath)) {
      console.log(`🗄️  Generating Prisma client for ${serviceName}...`);

      const prismaGenerateResult = spawn.sync("npx", ["prisma", "generate"], {
        cwd: serviceDir,
        stdio: "inherit",
      });

      if (prismaGenerateResult.status !== 0) {
        console.error(`❌ Failed to generate Prisma client for ${serviceName}`);
        process.exit(1);
      }
    }

    // Check if build script exists
    try {
      const servicePackageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, "utf8")
      );
      const scripts = servicePackageJson.scripts || {};

      if (scripts.build) {
        console.log(`🔨 Building ${serviceName}...`);

        const buildResult = spawn.sync("npm", ["run", "build"], {
          cwd: serviceDir,
          stdio: "inherit",
        });

        if (buildResult.status !== 0) {
          console.error(`❌ Failed to build ${serviceName}`);
          process.exit(1);
        }
      } else {
        console.log(
          `ℹ️  No build script found for ${serviceName}. Skipping build...`
        );
      }
    } catch (error) {
      console.error(
        `❌ Error reading package.json for ${serviceName}:`,
        error.message
      );
      continue;
    }

    console.log(`✅ Service ${serviceName} prepared successfully`);
  }

  // Prepare shared library
  const sharedDir = path.join(__dirname, "..", "shared");
  if (await existsAsync(sharedDir)) {
    const sharedPackageJsonPath = path.join(sharedDir, "package.json");

    if (await existsAsync(sharedPackageJsonPath)) {
      console.log("📦 Installing dependencies for shared library...");

      const installSharedResult = spawn.sync("npm", ["install"], {
        cwd: sharedDir,
        stdio: "inherit",
      });

      if (installSharedResult.status !== 0) {
        console.error("❌ Failed to install dependencies for shared library");
        process.exit(1);
      }

      // Check if shared library has build script
      try {
        const sharedPackageJson = JSON.parse(
          fs.readFileSync(sharedPackageJsonPath, "utf8")
        );
        const scripts = sharedPackageJson.scripts || {};

        if (scripts.build) {
          console.log("🔨 Building shared library...");

          const buildSharedResult = spawn.sync("npm", ["run", "build"], {
            cwd: sharedDir,
            stdio: "inherit",
          });

          if (buildSharedResult.status !== 0) {
            console.error("❌ Failed to build shared library");
            process.exit(1);
          }
        }
      } catch (error) {
        console.error("❌ Error reading shared package.json:", error.message);
      }

      console.log("✅ Shared library prepared successfully");
    }
  }

  console.log("🎉 All microservices prepared successfully!");
  console.log("💡 You can now run 'npm start' to start all services");
}

prepareServices().catch((err) => {
  console.error("❌ Error preparing microservices:", err);
  process.exit(1);
});
