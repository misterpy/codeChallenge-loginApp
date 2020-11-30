import { User } from './user.model';

export interface AuthenticatedResponse {
  token: string;
  user: User;
}
