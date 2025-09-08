declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGO_URL: string;
    JWT_SECRET: string;
    REFRESH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    FRONTEND_URL: string;
  }
}
