import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
const directory = process.argv[2];
if (!directory || process.argv.length !== 3) throw Error("Usage: node scripts/check-manual-bundles.mjs <candidate-directory>");
let checked = 0;
async function scan(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (/\.(?:js|json|html|map)$/.test(entry.name)) {
      const text = await readFile(file, "utf8");
      if (/GEMINI_API_KEY|GEMINI_MODEL|x-goog-api-key|generativelanguage\.googleapis\.com|AIza[\w-]{30,}/.test(text))
        throw Error(`Provider/credential marker found in client artifact: ${path.relative(directory, file)} (contents not printed)`);
      checked++;
    }
  }
}
await scan(path.join(directory, ".next", "static"));
if (!checked) throw Error("No built client artifacts found; build the clean candidate first.");
console.log(JSON.stringify({ clientArtifactsChecked: checked, providerCredentialMarkers: 0 }));
