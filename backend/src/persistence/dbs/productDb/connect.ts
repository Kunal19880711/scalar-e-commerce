import mongoose, { Connection } from "mongoose";
import { envConfig } from "../../../utils";

type IConnectionState = {
  connection: Connection | null;
  uri: string | null;
};

const connectionState: IConnectionState = {
  connection: null,
  uri: null,
};

export async function ensureProductDbConnection(): Promise<Connection> {
  try {
    const connection = await getConnection().asPromise();
    console.log("Connected to Products Mongo DB");
    return connection;
  } catch (error) {
    console.error(
      `Failed to connect to Products Mongo DB. URI[${connectionState.uri}]`,
      error
    );
    throw error;
  }
}

export function getConnection(): Connection {
  if (!connectionState.connection) {
    connectionState.uri = getConnectionUri();
    // console.debug(
    //   `Connecting to Products Mongo DB. URI[${connectionState.uri}]`
    // );
    connectionState.connection = mongoose.createConnection(connectionState.uri);
  }
  return connectionState.connection;
}

function getConnectionUri() {
  const serverConfig = envConfig();
  const userId = serverConfig.PRODUCT_MONGO_USERID;
  const password = serverConfig.PRODUCT_MONGO_DBPASSWORD;
  const host = serverConfig.PRODUCT_MONGO_URL;
  const appName = serverConfig.PRODUCT_MONGO_APPNAME;

  return `mongodb+srv://${userId}:${password}@${host}?retryWrites=true&w=majority&appName=${appName}`;
}
