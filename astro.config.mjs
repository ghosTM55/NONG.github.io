import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://nong.studio",
  output: "static",
  redirects: {
    "/curation/demo/": "/demo/objects/",
    "/curation/space/": "/demo/space/",
  },
});
