import * as path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    // This manual remapping is only needed because we're loading a locally linked version of the JS client
    resolve: {
        alias: [
            {
                find: "chromadb-default-embed",
                replacement: path.resolve(
                    __dirname,
                    "node_modules",
                    "chromadb-default-embed",
                ),
            },
        ],
    },
});
