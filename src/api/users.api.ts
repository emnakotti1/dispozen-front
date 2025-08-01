import { apiFetch } from "./client";

export type User = {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  password: string;
  
};

export function getUsers() {
  return apiFetch<User[]>("/users");
}

export function createUser(user: User) {
  return apiFetch<User>("auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}
