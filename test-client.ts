import { client } from "./src/lib/api/generated/client.gen.js";
import {
  categoryGroupsControllerFindAll,
  categoryGroupsControllerFindOne,
} from "./src/lib/api/generated/sdk.gen.js";

client.setConfig({ baseUrl: "http://localhost:8001" });

async function test() {
  const allGroups = await categoryGroupsControllerFindAll();
  console.log("findAll groups length:", allGroups.data?.length);

  if (allGroups.data?.length > 0) {
    const groupId = allGroups.data[0]._id;
    console.log("Fetching group ID:", groupId);
    const result = await categoryGroupsControllerFindOne({
      path: { id: groupId },
    });
    console.log("Result type:", Object.prototype.toString.call(result.data));
    console.log("Result object:", result.data);
  } else {
    console.log("No category groups to test findOne");
  }
}

test().catch(console.error);
