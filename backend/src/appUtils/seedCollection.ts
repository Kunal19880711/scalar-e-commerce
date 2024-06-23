import { Connection, Model } from "mongoose";

import { ensureProductDbConnection } from "../persistence";

export enum DBNames {
  Product = "Product",
}

export enum SeedingStrategy {
  InsertMany = "InsertMany",
  OneByOne = "OneByOne",
}

export type SeedCollectionOptions = {
  dbName: DBNames;
  strategy: SeedingStrategy;
};

const defaultOptions: SeedCollectionOptions = {
  dbName: DBNames.Product,
  strategy: SeedingStrategy.InsertMany,
};

export async function seedCollection(
  model: Model<any, {}>,
  entries: any[],
  options: Partial<SeedCollectionOptions> = defaultOptions
): Promise<void> {
  const dbName: DBNames = options.dbName || defaultOptions.dbName;
  const strategy: SeedingStrategy = options.strategy || defaultOptions.strategy;
  let connection: Connection | null = null;
  try {
    connection = await getConnection(dbName);
    console.log("db connected");

    console.log("dropping existing model");
    await model.collection.drop();
    console.log("dropped existing model");

    if (strategy === SeedingStrategy.OneByOne) {
      for (const entry of entries) {
        console.log("inserting document in DB.");
        await model.create(entry);
        console.log("document added to DB");
      }
    } else {
      console.log("inserting document in DB.");
      await model.insertMany(entries);
      console.log("document added to DB");
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
      console.log("db disconnected");
      await connection.destroy();
      console.log("db connection destroyed");
    }
  }
}

async function getConnection(dbName: DBNames): Promise<Connection> {
  switch (dbName) {
    case DBNames.Product:
      return await ensureProductDbConnection();
    default:
      throw new Error(`unknown db name: ${dbName}`);
  }
}
