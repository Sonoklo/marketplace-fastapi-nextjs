export interface AccountRegister {
  username: string;
  email: string;
  password: string;
  repeat_password: string;
}

export interface AccountResponse {
  id: number;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ItemCreate {
  name: string;
  description: string;
  price: number;
  count: number;
  category: string[];
}

export interface ItemResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  count: number;
  category: string[];
  user_id: number;
}
