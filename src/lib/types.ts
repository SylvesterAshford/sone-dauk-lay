export type Role = "admin" | "user";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  provider: string | null;
  avatar: string | null;
  created_at: string;
};
