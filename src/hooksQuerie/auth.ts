
import { useMutation } from "@tanstack/vue-query";
import { loginUser } from "../api/auth.api";
import type { LoginPayload, LoginResponse } from "../api/auth.api";
export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
  });
}
