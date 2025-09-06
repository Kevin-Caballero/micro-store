/**
 * Script para automatizar el proceso de:
 * 1. Construir el paquete shared
 * 2. Reinstalarlo en gateway y products
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Rutas de los directorios
const rootDir = __dirname;
const sharedDir = path.join(rootDir, "shared");
const gatewayDir = path.join(rootDir, "gateway");
const productsDir = path.join(rootDir, "products");
const ordersDir = path.join(rootDir, "orders");

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

/**
 * Ejecuta un comando en un directorio específico
 * @param {string} command Comando a ejecutar
 * @param {string} cwd Directorio donde ejecutar
 */
function runCommand(command, cwd) {
  try {
    console.log(
      `${colors.bright}${colors.blue}Ejecutando:${colors.reset} ${command} ${colors.cyan}en ${cwd}${colors.reset}`
    );
    execSync(command, {
      cwd,
      stdio: "inherit", // Muestra la salida en tiempo real
    });
    return true;
  } catch (error) {
    console.error(
      `${colors.bright}${colors.yellow}Error ejecutando:${colors.reset} ${command}`
    );
    console.error(error.message);
    return false;
  }
}

/**
 * Reinstala el paquete shared en un servicio específico
 * @param {string} serviceName Nombre del servicio
 * @param {string} serviceDir Directorio del servicio
 */
function reinstallSharedInService(serviceName, serviceDir) {
  console.log(
    `\n${colors.bright}${colors.green}Reinstalando shared en ${serviceName}...${colors.reset}\n`
  );
  if (!runCommand("npm remove @micro-store/shared", serviceDir)) {
    console.log(
      `No se pudo desinstalar el paquete en ${serviceName}, continuando...`
    );
  }
  if (!runCommand("npm i ..\\shared\\", serviceDir)) {
    console.error(`Falló la instalación en ${serviceName}. Abortando.`);
    process.exit(1);
  }
}

// Función principal
async function updateShared() {
  console.log(
    `\n${colors.bright}${colors.magenta}=== Actualizando módulo shared ====${colors.reset}\n`
  );

  // 1. Construir el paquete shared
  console.log(
    `\n${colors.bright}${colors.green}1. Construyendo el paquete shared...${colors.reset}\n`
  );
  if (!runCommand("npm run build", sharedDir)) {
    console.error("Falló la construcción del paquete shared. Abortando.");
    process.exit(1);
  }

  // 2. Reinstalarlo en gateway
  reinstallSharedInService("gateway", gatewayDir);

  // 3. Reinstalarlo en products
  reinstallSharedInService("products", productsDir);

  // 4. Reinstalarlo en orders
  reinstallSharedInService("orders", ordersDir);

  console.log(
    `\n${colors.bright}${colors.green}¡Proceso completado exitosamente!${colors.reset}`
  );
  console.log(
    "Para aplicar los cambios, reinicia los servicios gateway y products."
  );
}

// Ejecutar la función principal
updateShared().catch((error) => {
  console.error("Error inesperado:", error);
  process.exit(1);
});
