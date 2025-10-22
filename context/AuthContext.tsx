import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, AdminUser } from '../types';
import * as api from '../services/api';

export interface AuthContextType {
  user: User | AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
  updateUserContext: (user: User | AdminUser) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            setLoading(true);
            try {
                const userId = sessionStorage.getItem('userId');
                if (userId) {
                    const userData = await api.fetchUserById(userId);
                    setUser(userData);
                }
            } catch (error) {
                console.error("Session check failed:", error);
                sessionStorage.removeItem('userId');
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        const userData = await api.login(username, password);
        if (userData) {
            setUser(userData);
            sessionStorage.setItem('userId', userData.id);
            return true;
        }
        return false;
    }, []);

    const register = useCallback(async (username: string, password: string): Promise<boolean> => {
        const newUser = await api.register(username, password);
        if (newUser) {
            setUser(newUser);
            sessionStorage.setItem('userId', newUser.id);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem('userId');
    }, []);

    const updateUserContext = useCallback((updatedUser: User | AdminUser) => {
        setUser(updatedUser);
    }, []);
    
    const isAdmin = user ? 'role' in user && user.role === 'admin' : false;

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, login, logout, register, updateUserContext }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
