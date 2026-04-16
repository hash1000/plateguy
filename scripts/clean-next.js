const fs = require("fs");
const path = require("path");

const nextDir = path.join(__dirname, "..", ".next");

try {
  fs.rmSync(nextDir, { recursive: true, force: true });
  // eslint-disable-next-line no-console
  console.log("Removed .next");
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("Failed to remove .next:", err?.message ?? err);
  process.exitCode = 1;
}

