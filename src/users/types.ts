export interface IStore {
  name: string;
  email: string;
  description: string;
  phone_number: string;
}

export interface IUpdate {
  name?: string;
  email?: string;
  description?: string;
  phone_number?: string;
  resolved?: boolean;
}