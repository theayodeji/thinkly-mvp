import type { Response } from "express";
import { logger } from "./logger.js";

export interface SSEEvent<T = any> {
  event: string;
  data: T;
}

class EventStreamManager {
  private clients: Map<string, Set<Response>> = new Map();
  private heartbeatTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startHeartbeat();
  }

  /**
   * Registers a new SSE response client for a user (or guest device)
   */
  public addClient(userId: string, res: Response): void {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }

    const userClients = this.clients.get(userId)!;
    userClients.add(res);
    logger.info(`[SSE] Client connected for userId: ${userId} (Total active connections for user: ${userClients.size})`);

    // Clean up when client disconnects
    res.on("close", () => {
      this.removeClient(userId, res);
    });
  }

  /**
   * Removes a client connection
   */
  public removeClient(userId: string, res: Response): void {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(res);
      logger.info(`[SSE] Client disconnected for userId: ${userId} (Remaining: ${userClients.size})`);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  /**
   * Sends an event to a specific user (all active connections for that userId)
   */
  public sendToUser<T = any>(userId: string, eventName: string, data: T): boolean {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.size === 0) {
      return false;
    }

    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    userClients.forEach((res) => {
      try {
        res.write(payload);
      } catch (err) {
        logger.error(`[SSE] Error writing payload to userId ${userId}: ${err}`);
        this.removeClient(userId, res);
      }
    });

    return true;
  }

  /**
   * Broadcasts an event to all connected users
   */
  public broadcast<T = any>(eventName: string, data: T): void {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((userClients, userId) => {
      userClients.forEach((res) => {
        try {
          res.write(payload);
        } catch (err) {
          logger.error(`[SSE] Error broadcasting payload to userId ${userId}: ${err}`);
          this.removeClient(userId, res);
        }
      });
    });
  }

  /**
   * Periodic ping to keep HTTP connections alive through proxies / load balancers
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) return;
    this.heartbeatTimer = setInterval(() => {
      this.clients.forEach((userClients, userId) => {
        userClients.forEach((res) => {
          try {
            res.write(":ping\n\n");
          } catch {
            this.removeClient(userId, res);
          }
        });
      });
    }, 25000);
  }
}

export const eventStreamManager = new EventStreamManager();
