import { defineConfig } from "astro/config";
import { readdir, rm } from "node:fs/promises";

async function removeFinderMetadata(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(encodeURIComponent(entry.name) + (entry.isDirectory() ? "/" : ""), directory);
    if (entry.isDirectory()) await removeFinderMetadata(url);
    else if (entry.name === ".DS_Store") await rm(url);
  }
}

export default defineConfig({
  site: "https://nong.studio",
  output: "static",
  integrations: [{
    name: "exclude-finder-metadata",
    hooks: { "astro:build:done": ({ dir }) => removeFinderMetadata(dir) },
  }],
  redirects: {
    "/curation/demo/": "/demo/objects/",
    "/curation/space/": "/demo/space/",
  },
});
