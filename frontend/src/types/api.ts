export interface ApiData {
  message: string;
  status: string;
  endpoints?: string[];
}

export interface LoginCredentials extends Record<string, string> {
  userid: string;
  password: string;
}

export interface RegistrationCredentials extends Record<string, string> {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  mobile: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export interface User {
  id: string;
  userid: string;
  username: string;
  email: string;
  mobile: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
  profileImage?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface RoleChangeRequest {
  userId: string;
  newRole: UserRole;
}

export interface ApiError {
  message: string;
  status?: number;
}