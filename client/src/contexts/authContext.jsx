import { createContext } from "react";
import { useNavigate } from "react-router-dom";

import * as authService from '../services/authService'
import usePersistedState from "../hooks/usePersistedState";

const AuthContext = createContext();

AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({
    children,
}) => {
    const navigate = useNavigate();
    const [auth, setAuth] = usePersistedState('auth', {});
  
    const loginSubmitHandler = async (values) => {
      const result = await authService.login(values.email, values.password)
  
      setAuth(result)
  
      localStorage.setItem('accessToken', result.accessToken)
      
      navigate('/')
    }
  
    const registerSubmitHandler = async (values) => {
      const result = await authService.register(values.email, values.password, values.username, values.imageUrl, values.profilePicture)
    
      setAuth(result)
      
      localStorage.setItem('accessToken', result.accessToken)
  
      navigate('/')
    }
  
    const logoutHandler = () => {
      setAuth({})
      localStorage.removeItem('accessToken');
    }
  
    const values = {
      loginSubmitHandler,
      registerSubmitHandler,
      logoutHandler,
      username: auth.username,
      email: auth.email,
      imageUrl: auth.imageUrl,
      profilePicture: auth.profilePicture,
      userId: auth._id,
      isAuthenticated: !!auth.accessToken,

    }

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;