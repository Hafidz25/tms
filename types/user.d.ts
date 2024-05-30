export type Roles = 'Admin' | 'Customer Service' | 'Team Member';

export interface User {
  id: string,
  name: string,
  email: string,
  role: Roles,
}