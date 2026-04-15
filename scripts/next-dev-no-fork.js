#!/usr/bin/env node
"use strict";

/**
 * Workaround for Windows environments where `next dev` fails with `Error: spawn EPERM`
 * due to child_process forking being blocked by antivirus / policy.
 *
 * This starts the dev server in-process by calling Next's internal `startServer()`
 * directly (avoids `child_process.fork` in `next dev`).
 */

const path = require("path");

function parseArgs(argv) {
  const args = { turbo: false, port: undefined, hostname: undefined };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--turbo" || arg === "--turbopack") {
      args.turbo = true;
      continue;
    }

    if (arg === "--port" || arg === "-p") {
      const value = argv[i + 1];
      if (!value) throw new Error("Missing value for --port");
      args.port = Number.parseInt(value, 10);
      i += 1;
      continue;
    }

    if (arg === "--hostname" || arg === "-H") {
      const value = argv[i + 1];
      if (!value) throw new Error("Missing value for --hostname");
      args.hostname = value;
      i += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      // Keep help minimal and aligned with what we support.
      // eslint-disable-next-line no-console
      console.log(
        [
          "next-dev-no-fork (workaround runner)",
          "",
          "Usage:",
          "  npm run dev -- [--port 3000] [--hostname localhost] [--turbo]",
          "",
          "Notes:",
          "  - Use `npm run dev:next` to run the normal `next dev` command.",
          "  - This avoids `child_process.fork`, which can be blocked on some Windows setups.",
        ].join("\n")
      );
      process.exit(0);
    }

    throw new Error(`Unsupported argument: ${arg}`);
  }

  return args;
}

async function loadNextConfigAndEnv(dir) {
  // This matches `next dev` behavior: load `.env*` and user config.
  const constants = require("next/dist/shared/lib/constants");
  const configModule = require("next/dist/server/config");
  const loadConfig = configModule?.default ?? configModule;

  await loadConfig(constants.PHASE_DEVELOPMENT_SERVER, dir, { silent: false });
}

async function main() {
  const dir = process.cwd();
  const args = parseArgs(process.argv.slice(2));

  if (process.env.NEXT_DEV_NO_FORK_DEBUG === "1") {
    // eslint-disable-next-line no-console
    console.error(`[next-dev-no-fork] cwd=${dir}`);
    process.on("exit", (code) => {
      // eslint-disable-next-line no-console
      console.error(`[next-dev-no-fork] exit code=${code}`);
    });
  }

  if (args.turbo) process.env.TURBOPACK = "1";

  const portFromEnv = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : undefined;
  const port = Number.isFinite(args.port) ? args.port : portFromEnv ?? 3000;
  const allowRetry = !Number.isFinite(args.port) && !Number.isFinite(portFromEnv);

  await loadNextConfigAndEnv(dir);

  const { startServer } = require("next/dist/server/lib/start-server");
  if (process.env.NEXT_DEV_NO_FORK_DEBUG === "1") {
    // eslint-disable-next-line no-console
    console.error(`[next-dev-no-fork] starting server on port=${port}`);
  }
  await startServer({
    dir,
    port,
    allowRetry,
    isDev: true,
    hostname: args.hostname,
    // keepAliveTimeout/minimalMode/selfSignedCertificate intentionally omitted
  });

  // The server keeps the process alive; nothing else to do here.
}

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
