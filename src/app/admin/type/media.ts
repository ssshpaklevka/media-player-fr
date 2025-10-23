export interface Banner {
  id: number;
  title: string;
  description: string;
  seconds: number;
  image: string;
  type: "image" | "video";
  is_active: boolean;
  location_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBannerDto {
  title: string;
  description: string;
  seconds: number;
  file: File;
  is_active: boolean;
  location_id: number;
}

export interface UpdateBannerDto {
  title?: string;
  description?: string;
  seconds?: number;
  file?: File;
  is_active?: boolean;
  location_id?: number;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  middlename: string;
  login: string;
  location_id?: number;
  role: "admin" | "user";
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface BannerResponse {
  success: boolean;
  data: Banner;
}

export interface BannersListResponse {
  success: boolean;
  data: Banner[];
}

export interface Location {
  id: number;
  name: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateLocationDto {
  name: string;
  address: string;
}

export interface UpdateLocationDto {
  name: string;
  address: string;
}

export interface LocationResponse {
  message: string;
  location: Location;
}

export interface DeleteLocationResponse {
  message: string;
  deleted: Location;
}
