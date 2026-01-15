import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-axios",
  input: "./swagger.json",
  output: {
    path: "src/lib/api/generated",
    format: "prettier",
  },
  plugins: ["@hey-api/typescript", "@hey-api/sdk"],
});
