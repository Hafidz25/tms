export type Roles = 'Admin' | 'Customer Server' | 'Team Member';

export interface User {
  id: string,
  name: string,
  email: string,
  role: Roles,
}