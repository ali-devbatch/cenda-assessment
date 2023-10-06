import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxDocument,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  addRxPlugin,
} from "rxdb";

import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBDevModePlugin);
// Add the RxDBUpdatePlugin
addRxPlugin(RxDBUpdatePlugin);


// Define the schema for tasks
export const taskSchema = {
  title: "task schema",
  description: "Describes a task",
  version: 0,
  primaryKey: "title", // Define the primary key
  properties: {
    title: {
      type: "string",
      maxLength: 255,
    },
    description: {
      type: "string",
    },
    status: {
      type: "string",
    },
    checkList: {
      type: "string",
    },
    completed: {
      type: "boolean",
      default: false,
    },
    createdAt: {
      type: "number",
      final: true,
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["title", "createdAt"],
  type: "object",
}  as const;

const schemaTyped = toTypedRxJsonSchema(taskSchema);
// aggregate the document type from the schema
export type HeroDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// create the typed RxJsonSchema from the literal typed object.
export const checkList: RxJsonSchema<HeroDocType> = taskSchema;


// // Create or open the RxDB database
// export const createDatabaseOwn = async () => {
//   try {
//     // Attempt to open the existing database
//     const db: RxDatabase = await createRxDatabase({
//       name: "mydb", // Replace with your database name
//       storage: getRxStorageDexie(),
//       ignoreDuplicate: true, // Ignore if the database already exists
//     });
//     return db;
//   } catch (error:any) {
//     if (error?.name === "RxError") {
//       // Database with the same name already exists, try opening it
//       const existingDb: RxDatabase = await createRxDatabase({
//         name: "mydb", // Replace with your database name
//         storage: getRxStorageDexie(),
//       });
//       return existingDb;
//     }
//     console.error("Error creating/opening the database:", error);
//     throw error;
//   }
// };

// Create or open the RxDB database
export const createDatabaseOwn = async () => {
  const db: RxDatabase = await createRxDatabase({
    name: "mydb", // Replace with your database name
    storage: getRxStorageDexie(),
ignoreDuplicate: true,
  });
  return db;
};


// Define a collection for tasks
let tasksCollection:any = null;

// Function to get the tasks collection
export const getTasksCollection = async (db: RxDatabase) => {
  if (!tasksCollection) {
    try {
      tasksCollection = await db.addCollections({
        tasks:{
        schema: checkList, // Use your schema here
        }
      });
    } catch (error) {
      console.error("Error creating tasks collection:", error);
      throw error;
    }
  }
  return tasksCollection.tasks;
};
