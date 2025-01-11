import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    
    if (savedToken) {
      setToken(savedToken);
      try {
        const decodedUser = jwtDecode<User>(savedToken);
        setUser(decodedUser);
      } catch (error) {
        console.error("Error decoding token:", error);
        
        signOut();
      }
    }
  }, []);

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch('https://irctc-backend-ns9u.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        console.log('User signed up successfully');
      } else {
        console.error('Sign-up failed');
      }
    } catch (error) {
      console.error('Sign-up error:', error);
    }
  };

 
  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('https://irctc-backend-ns9u.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token); // Persist token in localStorage
        try {
          const decodedUser = jwtDecode<User>(data.token);
          console.log(decodedUser);
          
          setUser(decodedUser);
          localStorage.setItem('user' , JSON.stringify(decodedUser) )
        } catch (error) {
          console.error("Error decoding token:", error);
          // If there's an error decoding the token, sign out the user
          signOut();
        }
        console.log('User signed in successfully');
      } else {
        console.error('Sign-in failed');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

 
  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
    console.log('User signed out');

  };

  return (
    <AuthContext.Provider value={{ token, user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

