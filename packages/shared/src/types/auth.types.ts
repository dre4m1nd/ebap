export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  user: {
    id: number;
    username: string;
    nickname: string;
  };
}
