import { ensureProductDbConnection } from "./persistence";
import { startWebServer } from "./webserver";

start();

async function start() {
  try {
    await startWebServer();
    await ensureProductDbConnection();
  } catch (err) {
    console.log(err);
  }
}
