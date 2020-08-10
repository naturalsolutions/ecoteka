import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const useSession = (session) => {

}

const signIn = async (credentials) => {
  const { username, password } = credentials

  if (!username || !password) {
    return
  }

  const { apiUrl } = publicRuntimeConfig;
  const signInUrl = `${apiUrl}/login/access-token/`
  const fetchOptions = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  }

  const response = await fetch(signInUrl, fetchOptions)
  const data = await response.json()

  console.log(data)
}

const signOut = async () => {

}

export default {
  useSession,
  signIn,
  signOut
}