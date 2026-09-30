import { api } from "./api";

export const explainerService = {
  generate: async (spaceId: string, concept: string, voiceId?: string) => {
    const response = await api.post(`/explainers/space/${spaceId}`, { concept, voiceId });
    return response.data.data;
  },
  
  getBySpaceId: async (spaceId: string) => {
    const response = await api.get(`/explainers/space/${spaceId}`);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/explainers/${id}`);
  },

  retryExplainer: async (id: string) => {
    const response = await api.post(`/explainers/${id}/retry`);
    return response.data.data;
  },
};
