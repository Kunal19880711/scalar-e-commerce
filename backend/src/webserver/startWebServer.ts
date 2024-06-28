import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import {rateLimit} from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize"; 

import "./controllers";
import { AppRouter } from "express-controller";
import { envConfig } from "../appUtils";
import { handleError, handleMongooseError } from "./middlewares";

type IServerConfig = {
  host: string;
  port: number;
  cors: CorsOptions;
};

// rate limiter: https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

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

  app.use(limiter);
  app.use(cors(corsConfig));
  app.use(cookieParser());
  app.use(express.json());
  app.use(mongoSanitize());
  app.use(AppRouter.instance);
  app.use(handleMongooseError);
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
