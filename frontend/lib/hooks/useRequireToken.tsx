import { useEffect } from "react";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { tokenStorage } = publicRuntimeConfig;

export function useRequireToken(redirectUrl = "/signin") {
  let token: any = undefined;
  if (typeof localStorage !== "undefined" && localStorage.getItem(tokenStorage)) {
    token = localStorage.getItem(tokenStorage);
  }
  const router = useRouter();

  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (!token) {
      router.push(redirectUrl);
    }
  }, [token, router]);

  return token;
}
