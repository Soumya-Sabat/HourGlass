import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type CachedConnection = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: CachedConnection;
};

const cached = globalWithMongoose.mongooseConnection ?? {
  connection: null,
  promise: null,
};

globalWithMongoose.mongooseConnection = cached;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI.");
  }

  if (cached.connection) {
    return cached.connection;
  }

  cached.promise ??= mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });
  cached.connection = await cached.promise;

  return cached.connection;
}
