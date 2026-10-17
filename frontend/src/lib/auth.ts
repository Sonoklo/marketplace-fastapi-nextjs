import api from './api';
import { AccountRegister, AccountResponse, Token, LoginCredentials, ItemCreate, ItemResponse } from './types';

export const authApi = {
  register: async (data: AccountRegister): Promise<void> => {
    await api.post('/register/', data);
  },

  login: async (credentials: LoginCredentials): Promise<Token> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<Token>('/login/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProfile: async (): Promise<AccountResponse> => {
    const response = await api.get<AccountResponse>('/profile/');
    return response.data;
  },

  createItem: async (item: ItemCreate): Promise<ItemResponse> => {
    const response = await api.post<ItemResponse>('/profile/items', item);
    return response.data;
  },
};
