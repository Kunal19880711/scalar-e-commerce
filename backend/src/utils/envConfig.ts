import dotenv from "dotenv";

export type EnvConfig = {
  [key: string]: string;
};

type ConfigState = {
  config: EnvConfig | null;
};

const configState: ConfigState = {
  config: null,
};

export function envConfig(): EnvConfig {
  if (!configState.config) {
    dotenv.config();
    configState.config = process.env as EnvConfig;
  }
  return configState.config;
}
