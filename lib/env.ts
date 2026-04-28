function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getMongoUri() {
  return getEnv("MONGODB_URI");
}

export function getJwtSecret() {
  return getEnv("JWT_SECRET");
}
