export interface Individual {
  id?: number;
  firstName: string;
  lastName: string;
  login?: string;
  birthDate?: string; // Format: YYYY-MM-DD
}

export interface WhoAmI {
  name: string;
  authorities: string[];
}
