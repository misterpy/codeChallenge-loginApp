import { LoginPayload } from './login.model';

export interface RegisterPayload extends LoginPayload {
  name: string;
}
