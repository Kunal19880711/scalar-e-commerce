import { UserModel } from "../persistence";
import users from "../json/users.json";

import {
  DBNames,
  SeedCollectionOptions,
  SeedingStrategy,
  seedCollection,
} from "../appUtils";

const seedingOps: SeedCollectionOptions = {
  dbName: DBNames.Product,
  strategy: SeedingStrategy.OneByOne,
};
seedCollection(UserModel, users, seedingOps);
