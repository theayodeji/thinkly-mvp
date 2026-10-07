import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getOrCreateGuestDeviceId } from "../shared/utils/guest";

export type SSECallback<T = any> = (data: T) => void;

class EventStreamClient {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<SSECallback>> = new Map();
  private isConnecting: boolean = false;
  private retryTimeout: NodeJS.Timeout | null = null;
  private retryCount: number = 0;

  public connect(): void {
    if (this.eventSource || this.isConnecting) return;
    this.isConnecting = true;

    const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
    const guestDeviceId = getOrCreateGuestDeviceId();
    const url = `${baseUrl}/events/subscribe?guestDeviceId=${encodeURIComponent(guestDeviceId)}`;

    try {
      const es = new EventSource(url, { withCredentials: true });
      this.eventSource = es;

      es.onopen = () => {
        this.isConnecting = false;
        this.retryCount = 0;
      };

      // Re-attach any listeners that were registered prior to connection opening
      this.listeners.forEach((_, eventName) => {
        this.attachEventListener(eventName);
      });

      es.onerror = () => {
        this.isConnecting = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Reconnect with exponential backoff (capped at 30s)
        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
        this.retryCount++;
        if (this.retryTimeout) clearTimeout(this.retryTimeout);
        this.retryTimeout = setTimeout(() => this.connect(), delay);
      };
    } catch {
      this.isConnecting = false;
    }
  }

  public subscribe<T = any>(eventName: string, callback: SSECallback<T>): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
      if (this.eventSource) {
        this.attachEventListener(eventName);
      }
    }

    const handlers = this.listeners.get(eventName)!;
    handlers.add(callback);

    this.connect();

    return () => {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.listeners.delete(eventName);
      }
    };
  }

  private attachEventListener(eventName: string): void {
    if (!this.eventSource) return;

    // Standard EventSource event registration for custom named events
    this.eventSource.addEventListener(eventName, (e: MessageEvent) => {
      try {
        const parsed = JSON.parse(e.data);
        const handlers = this.listeners.get(eventName);
        handlers?.forEach((cb) => cb(parsed));
      } catch (err) {
        console.error(`[SSE Client] Error parsing payload for event ${eventName}:`, err);
      }
    });
  }

  public disconnect(): void {
    if (this.retryTimeout) clearTimeout(this.retryTimeout);
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnecting = false;
  }
}

export const eventStreamClient = new EventStreamClient();

/**
 * Custom hook to listen to real-time Server-Sent Events (SSE)
 */
export function useEventListener<T = any>(eventName: string, callback: (data: T) => void) {
  const savedHandler = useRef(callback);

  useEffect(() => {
    savedHandler.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (data: T) => savedHandler.current(data);
    const unsubscribe = eventStreamClient.subscribe<T>(eventName, handler);
    return () => {
      unsubscribe();
    };
  }, [eventName]);
}

/**
 * Custom helper hook to automatically invalidate React Query keys on SSE events
 */
export function useQueryInvalidator(eventName: string, queryKey: unknown[]) {
  const queryClient = useQueryClient();

  useEventListener(eventName, () => {
    queryClient.invalidateQueries({ queryKey });
  });
}
