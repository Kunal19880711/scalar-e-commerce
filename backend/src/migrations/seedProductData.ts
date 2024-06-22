import { ProductModel } from "../persistence";
import products from "../json/products.json";

import {
  DBNames,
  SeedCollectionOptions,
  SeedingStrategy,
  seedCollection,
} from "../appUtils";

const seedingOps: SeedCollectionOptions = {
  dbName: DBNames.Product,
  strategy: SeedingStrategy.InsertMany,
};
seedCollection(ProductModel, products, seedingOps);
