export interface StoredProcResponse {
  message: string;
  status: string;
}

export interface StoredProcConfig {
  id: string;
  title: string;
  description: string;
  endpoint: string;
  badgeColor: string;
  requiresAdmin: boolean;
}
