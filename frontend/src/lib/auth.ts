import api from './api';
import { AccountRegister, AccountResponse, Token, LoginCredentials, AccountUpdate, ProfileResponse, AccountUpdateWithTokenResponse } from './types';

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

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/profile/');
    return response.data;
  },

  updateProfile: async (data: AccountUpdate): Promise<AccountUpdateWithTokenResponse> => {
    const response = await api.patch<AccountUpdateWithTokenResponse>('/profile/', data);
    return response.data;
  },
};
