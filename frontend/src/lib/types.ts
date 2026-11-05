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

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface ItemCreate {
  name: string;
  description?: string;
  price: number;
  count: number;
  categories: string;
}

export interface ItemResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  count: number;
  categories: CategoryResponse[];
  user_id: number;
}

export interface ItemUpdate {
  name?: string;
  description?: string;
  count?: number;
  price?: number;
  category?: string[];
}

export interface AccountUpdate {
  username?: string;
  email?: string;
  password?: string;
  repeat_password?: string;
}

export interface PurchaseResponse {
  id: number;
  account_id: number;
  item_id: number;
  price: number;
  count: number;
  created_at: string;
  item?: ItemResponse;
}

export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  items: ItemResponse[];
  purchases: PurchaseResponse[];
}

export interface BookmarkCreate {
  item_id: number;
}

export interface BookmarkResponse {
  id: number;
  account_id: number;
  item_id: number;
  created_at: string;
  item: ItemResponse | null;
}
