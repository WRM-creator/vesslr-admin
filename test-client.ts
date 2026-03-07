import { client } from "./src/lib/api/generated/client.gen.js";
import {
  adminAuthControllerLogin,
  adminOrganizationsControllerFindAll,
} from "./src/lib/api/generated/sdk.gen.js";

client.setConfig({ baseUrl: "http://localhost:8001" });

async function test() {
  // Login to get auth token
  const loginResult = await adminAuthControllerLogin({
    body: {
      email: process.env.ADMIN_EMAIL || "admin@vesslr.com",
      password: process.env.ADMIN_PASSWORD || "",
    },
  });

  if (!loginResult.data) {
    console.error("Login failed:", loginResult.error);
    process.exit(1);
  }

  const token = (loginResult.data as any)?.data?.accessToken;
  if (!token) {
    console.error("No access token in login response:", loginResult.data);
    process.exit(1);
  }
  console.log("Logged in successfully");

  client.interceptors.request.use((request) => {
    request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  });

  // Test: fetch all organizations (no filter)
  console.log("\n--- All organizations ---");
  const all = await adminOrganizationsControllerFindAll({
    query: { page: "1", limit: "10" },
  });
  const allData = (all.data as any)?.data;
  console.log("Total:", allData?.totalDocs);
  console.log("Docs:", allData?.docs?.map((o: any) => ({ id: o._id, name: o.name })));

  // Test: count by onboardingStep
  const steps = ["identity_kyc", "residential", "company_info", "product_categories", "company_documents", "declarations_risk", "review", "status", "complete"];
  for (const step of steps) {
    const result = await adminOrganizationsControllerFindAll({
      query: { page: "1", limit: "100", onboardingStep: step },
    });
    const count = (result.data as any)?.data?.totalDocs ?? 0;
    if (count > 0) {
      console.log(`\nStep "${step}": ${count} org(s)`);
      (result.data as any)?.data?.docs?.forEach((o: any) => {
        console.log(`  - ${o.name} (${o._id})`);
      });
    }
  }
}

test().catch(console.error);
