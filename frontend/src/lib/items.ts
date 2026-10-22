import api from './api';
import { ItemCreate, ItemResponse, ItemUpdate, PurchaseResponse } from './types';

export const itemsApi = {
  getAllItems: async (): Promise<ItemResponse[]> => {
    const response = await api.get<ItemResponse[]>('/main/');
    return response.data;
  },

  buyItem: async (itemId: number, count: number): Promise<PurchaseResponse> => {
    const response = await api.post<PurchaseResponse>('/main/', { item_id: itemId, count });
    return response.data;
  },

  createItem: async (data: ItemCreate): Promise<ItemResponse> => {
    const response = await api.post<ItemResponse>('/profile/items', data);
    return response.data;
  },

  updateItem: async (itemId: number, data: ItemUpdate): Promise<ItemResponse> => {
    const response = await api.patch<ItemResponse>(`/profile/items/${itemId}`, data);
    return response.data;
  },

  deleteItem: async (itemId: number): Promise<void> => {
    await api.delete(`/profile/items/${itemId}`);
  },
};
