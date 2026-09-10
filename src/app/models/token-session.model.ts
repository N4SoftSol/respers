export interface UserTokenSession {
  username: string;
  tokenId: number;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
  expirationStatus: string;
  totalDuration: string;
  timeLeft: string;
}

export interface CheckTokensResponse {
  count: number;
  users: UserTokenSession[];
  status: string;
}
