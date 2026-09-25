import { api } from "./api";
import { ISpace, ISource, SpaceSchema, SourceSchema } from "@thinkly/shared";
import { z } from "zod";
import toast from "react-hot-toast";

export const spaceService = {
  // Space collection operations
  getSpaces: async (): Promise<{ spaces: ISpace[] }> => {
    const response = await api.get<{ spaces: ISpace[] }>("/spaces");
    return { spaces: z.array(SpaceSchema).parse(response.data.spaces) as ISpace[] };
  },

  createSpace: async (): Promise<ISpace> => {
    const response = await api.post<{ space: ISpace }>("/spaces/create");
    return SpaceSchema.parse(response.data.space) as ISpace;
  },

  getSpaceSources: async (spaceId: string): Promise<ISource[]> => {
    const response = await api.get<{ sources: ISource[] }>(`/sources/${spaceId}`);
    return z.array(SourceSchema).parse(response.data.sources) as ISource[];
  },

  addSource: async (id: string, source: Partial<ISource>): Promise<ISource> => {
    try {
      const response = await api.post<{ source: ISource }>(`/sources/add`, {
        spaceId: id,
        ...source,
      });
      toast.success("Source added successfully");
      return SourceSchema.parse(response.data.source) as ISource;
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to add source";
      toast.error(message);
      throw error;
    }
  },

  deleteSource: async (id: string): Promise<void> => {
    await api.delete(`/sources/${id}`);
  },

  deleteSpace: async (id: string): Promise<void> => {
    await api.delete(`/spaces/delete/${id}`);
  },

  // Single Space operations
  getSpace: async (id: string): Promise<ISpace> => {
    const response = await api.get<{ space: ISpace }>(`/spaces/${id}`);
    return SpaceSchema.parse(response.data.space) as ISpace;
  },

  updateSpace: async (id: string, updates: Partial<ISpace>): Promise<ISpace> => {
    const response = await api.put<{ space: ISpace }>(`/spaces/rename/${id}`, updates);
    return SpaceSchema.parse(response.data.space) as ISpace;
  },

  streamChat: async (
    spaceId: string,
    message: string,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    await api.post(`/spaces/chat`, { spaceId, message }, {
      signal,
      onDownloadProgress: (progressEvent) => {
        const responseText = (progressEvent.event.currentTarget as XMLHttpRequest).responseText;
        if (!responseText) return;

        let fullResponse = "";
        const lines = responseText.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }
            if (data === '[ERROR]') {
              throw new Error("Server streaming error");
            }
            try {
              const parsed = JSON.parse(data);
              fullResponse += parsed.text;
            } catch (e) {
              // Ignore incomplete JSON
            }
          }
        }
        
        onChunk(fullResponse);
      }
    });
  },

  getChatHistory: async (spaceId: string, cursor?: string): Promise<{ history: { role: "user" | "assistant", content: string }[], hasMore: boolean, nextCursor?: string }> => {
    const params = cursor ? { cursor } : {};
    const response = await api.get<{ history: any[], hasMore: boolean, nextCursor?: string }>(`/spaces/${spaceId}/chat`, { params });
    return response.data;
  },
};
