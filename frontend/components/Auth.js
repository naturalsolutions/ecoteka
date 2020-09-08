import getConfig from "next/config";
import { useContext, createContext, useState, useEffect } from "react";
import api from '../lib/api'

const { publicRuntimeConfig } = getConfig();

const StoreContext = createContext();

const SessionProvider = ({ children }) => {
  const { tokenStorage } = publicRuntimeConfig;
  let initialState = null

  if (typeof window !== 'undefined') {
    initialState = localStorage.getItem(tokenStorage)
  }

  const [session, setSession] = useState(initialState);

  useEffect(function watchForChanges() {
    if (session) {
      localStorage.setItem(tokenStorage, session)
    } else {
      localStorage.removeItem(tokenStorage)
    }
  }, [session]);

  return (
    <StoreContext.Provider value={{ session, setSession }}>
      {children}
    </StoreContext.Provider>
  );
}

const useSession = () => useContext(StoreContext)

const signIn = async (credentials) => {
  const { apiUrl, tokenStorage } = publicRuntimeConfig;
  const { username, password } = credentials

  if (!username || !password) {
    return
  }

  const signInUrl = `${apiUrl}/auth/login/access-token`

  const body = new FormData();

  body.append('username', username);
  body.append('password', password);

  const headers = {};
  const fetchOptions = {
    method: 'post',
    body: body
  };

  const response = await api.post(
    signInUrl,
    headers,
    body
    )

  const data = await response.json()

  if (data) {
    const { access_token: accessToken } = data
    return accessToken
  }

  return false
}

export default {
  SessionProvider,
  useSession,
  signIn
}