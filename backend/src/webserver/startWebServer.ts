import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import "./controllers";
import { AppRouter } from "express-controller";
import { envConfig } from "../appUtils";
import { handleError } from "./middlewares";

type IServerConfig = {
  host: string;
  port: number;
  cors: CorsOptions;
};

function getServerConfig(): IServerConfig {
  const serverConfig = envConfig();

  const host: string = serverConfig.SERVER_HOST;
  const port: number = parseInt(serverConfig.SERVER_PORT);
  const origin: string | string[] = JSON.parse(serverConfig.SERVER_CORS_ORIGIN);
  const credentials: boolean =
    JSON.parse(serverConfig.SERVER_CORS_CREDENTIALS) || false;

  return { host, port, cors: { origin, credentials } };
}

export async function startWebServer(): Promise<void> {
  const app = express();
  const { host, port, cors: corsConfig } = getServerConfig();

  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(cookieParser());
  app.use(AppRouter.instance);
  app.use(handleError);

  return new Promise((resolve, reject) => {
    app
      .listen(port, host, () => {
        console.log(`Listening on host ${host} and port ${port}`);
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}
