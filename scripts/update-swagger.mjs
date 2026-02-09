import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const SWAGGER_URL =
  process.env.VITE_SWAGGER_URL || "http://localhost:3000/api/docs-json";
const OUTPUT_FILE = path.join(__dirname, "../swagger.json");

console.log(`Fetching swagger.json from ${SWAGGER_URL}...`);

try {
  const response = await fetch(SWAGGER_URL);
  if (!response.ok) {
    console.error(`Failed to fetch: ${response.status}`);
    process.exit(1);
  }

  const data = await response.text();

  // Validate JSON
  JSON.parse(data);

  // Check if existing file exists and compare content
  let existingContent = "";
  if (fs.existsSync(OUTPUT_FILE)) {
    existingContent = fs.readFileSync(OUTPUT_FILE, "utf8");
  }

  if (existingContent === data) {
    console.log("swagger.json is already up to date");
  } else {
    fs.writeFileSync(OUTPUT_FILE, data);
    console.log(`Successfully updated ${OUTPUT_FILE}`);
  }
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
