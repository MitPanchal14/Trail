// Stages a reviewed commit locally. This script never links a host or uploads.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const git = (...args) => execFileSync("git", args, { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const ref = process.argv[2];
if (!ref || process.argv.length !== 3) throw Error("Usage: node scripts/prepare-manual-demo.mjs <reviewed-commit>");
const commit = git("rev-parse", "--verify", `${ref}^{commit}`).toString().trim();
const parent = path.join(tmpdir(), "opencode");
await mkdir(parent, { recursive: true });
const directory = await mkdtemp(path.join(parent, "trail-manual-demo-"));
const rootFiles = new Set(["package.json", "package-lock.json", "next.config.ts", "next-env.d.ts", "tsconfig.json", "eslint.config.mjs"]);
const files = [];
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
for (const entry of git("ls-tree", "-rz", commit).toString().split("\0").filter(Boolean)) {
  const [metadata, name] = entry.split("\t");
  if (!rootFiles.has(name) && !/^(app|components|lib|public)\//.test(name)) continue;
  if (!/^100(?:644|755) blob /.test(metadata) || name.split("/").some(p => p === ".." || p.startsWith(".")))
    throw Error(`Refusing non-regular or hidden source path: ${name}`);
  const content = git("show", `${commit}:${name}`);
  await mkdir(path.dirname(path.join(directory, name)), { recursive: true });
  await writeFile(path.join(directory, name), content);
  files.push({ path: name, sha256: hash(content), source: commit });
}
for (const name of rootFiles) if (!files.some(f => f.path === name)) throw Error(`Required file missing: ${name}`);
for (const [source, destination] of [["deployment/manual-demo.vercel.json", "vercel.json"], ["deployment/manual-demo.vercelignore", ".vercelignore"]]) {
  const content = await readFile(path.join(root, source));
  await writeFile(path.join(directory, destination), content);
  files.push({ path: destination, sha256: hash(content), source });
}
const manifest = { directory, commit, mode: "public-manual", hosting: "Vercel; account/project/hostname approval required", files };
await writeFile(path.join(directory, "_deployment-review.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
