import cron from "node-cron";
import { config } from "../config/env.js";
const BASE_URL = config.BASE_URL;
/**
 * Pings the server to keep it awake
 */
const pingServer = async () => {
    try {
        console.log(`[${new Date().toISOString()}] Pinging server to keep it awake`);
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        console.log(`[${new Date().toISOString()}] Server pinged successfully`);
    }
    catch (error) {
        console.error(`[${new Date().toISOString()}] Error pinging server:`, error);
    }
};
/**
 * Initializes the keep-alive functionality
 * Runs the ping every 15 minutes
 */
function initKeepAlive() {
    if (config.NODE_ENV !== "production") {
        console.log("Keep-alive is disabled in development mode");
        return;
    }
    console.log("Initializing keep-alive service...");
    // Schedule the ping to run every 15 minutes
    cron.schedule("*/15 * * * *", () => {
        pingServer();
    });
    // Initial ping when the server starts
    pingServer();
}
export default initKeepAlive;
