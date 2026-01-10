import { spawn } from "child_process";

const child = spawn("npx", ["serve", "-s", "dist", "-l", "3000"], {
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(`spawn error: ${error}`);
});

child.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
