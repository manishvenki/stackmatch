#!/usr/bin/env node

/**
 * StackMatch — Full-Stack Unified Project Runner
 * Concurrently boots and orchestrates:
 * 1. Shared Types Package (@stackmatch/types build)
 * 2. Express Backend API (Port 5000)
 * 3. Vite Web Frontend (Port 5173)
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = __dirname;
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const WEB_DIR = path.join(ROOT_DIR, 'apps', 'web');
const TYPES_DIR = path.join(ROOT_DIR, 'packages', 'types');

// ANSI Colors for clean terminal readability
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function logHeader() {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   StackMatch — Planning Studio Orchestrator${colors.reset}`);
  console.log(`${colors.dim}   Plan smarter. Choose better. Build with confidence.${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);
}

// 1. Ensure .env files exist
function ensureEnvFiles() {
  const rootEnv = path.join(ROOT_DIR, '.env');
  const rootEnvEx = path.join(ROOT_DIR, '.env.example');
  const backendEnv = path.join(BACKEND_DIR, '.env');
  const backendEnvEx = path.join(BACKEND_DIR, '.env.example');

  if (!fs.existsSync(rootEnv) && fs.existsSync(rootEnvEx)) {
    fs.copyFileSync(rootEnvEx, rootEnv);
    console.log(`${colors.yellow}[Setup] Created .env in root from .env.example${colors.reset}`);
  }

  if (!fs.existsSync(backendEnv) && fs.existsSync(backendEnvEx)) {
    fs.copyFileSync(backendEnvEx, backendEnv);
    console.log(`${colors.yellow}[Setup] Created backend/.env from backend/.env.example${colors.reset}`);
  }
}

// 2. Build shared types synchronously first
function buildSharedTypes() {
  return new Promise((resolve, reject) => {
    console.log(`${colors.blue}[Build]${colors.reset} Compiling shared types (@stackmatch/types)...`);
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(npmCmd, ['run', 'build'], {
      cwd: TYPES_DIR,
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`${colors.green}[Build]${colors.reset} Shared types built successfully.\n`);
        resolve();
      } else {
        console.warn(`${colors.yellow}[Build Warning]${colors.reset} Types compilation finished with code ${code}, continuing...`);
        resolve();
      }
    });

    child.on('error', (err) => {
      console.warn(`${colors.yellow}[Build Warning]${colors.reset} Could not build types: ${err.message}`);
      resolve();
    });
  });
}

// 3. Process management
const processes = [];

function startProcess(prefix, color, command, args, cwd) {
  const npmCmd = process.platform === 'win32' ? `${command}.cmd` : command;
  const child = spawn(npmCmd, args, {
    cwd,
    shell: true,
    env: { ...process.env, FORCE_COLOR: 'true' },
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}[${prefix}]${colors.reset} ${line}`);
      }
    }
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${color}[${prefix}]${colors.reset} ${line}`);
      }
    }
  });

  child.on('close', (code) => {
    console.log(`${color}[${prefix}]${colors.reset} Exited with code ${code}`);
  });

  processes.push(child);
  return child;
}

// 4. Graceful termination handler
function setupShutdown() {
  const cleanExit = () => {
    console.log(`\n${colors.yellow}[Shutdown] Stopping StackMatch processes...${colors.reset}`);
    for (const proc of processes) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', proc.pid.toString(), '/f', '/t'], { stdio: 'ignore' });
        } else {
          proc.kill('SIGTERM');
        }
      } catch (_) {}
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanExit);
  process.on('SIGTERM', cleanExit);
}

// 5. Main launcher
async function main() {
  logHeader();
  ensureEnvFiles();
  setupShutdown();

  await buildSharedTypes();

  console.log(`${colors.green}${colors.bold}[Services Starting]${colors.reset}`);
  console.log(`  ${colors.cyan}● Web Frontend:${colors.reset} http://localhost:5173`);
  console.log(`  ${colors.magenta}● Backend API:${colors.reset}  http://localhost:5000/api/v1/health\n`);

  // Start Backend Server (port 5000)
  startProcess('Backend', colors.magenta, 'npm', ['run', 'dev'], BACKEND_DIR);

  // Start Web App (port 5173)
  startProcess('Web-UI', colors.cyan, 'npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'], WEB_DIR);
}

main().catch((err) => {
  console.error(`${colors.red}[Error] Failed to start StackMatch:${colors.reset}`, err);
  process.exit(1);
});
