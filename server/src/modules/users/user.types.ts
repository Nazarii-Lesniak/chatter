export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface RegisterInput {
  username: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}
