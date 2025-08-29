// FILE: contexts/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";


type User = { id: string; name: string; email: string; avatar_url?: string; role?: string; influencer_status?: string };

type AuthCtx = {
    user: User | null;
    tokens: { accessToken: string; refreshToken: string } | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;   // 👈 NEW
};

const Ctx = createContext<AuthCtx>({
    user: null,
    tokens: null,
    loading: false,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    updateUser: () => { },
});

const API_URL = "http://192.168.68.79:3000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                const storedTokens = await AsyncStorage.getItem("tokens");
                if (storedUser && storedTokens) {
                    setUser(JSON.parse(storedUser));
                    setTokens(JSON.parse(storedTokens));
                }
            } finally {
                setLoading(false);
            }
        };
        loadSession();
    }, []);

    const saveSession = async (user: User, tokens: any) => {
        setUser(user);
        setTokens(tokens);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("tokens", JSON.stringify(tokens));
    };

    const updateUser = (updates: Partial<User>) => {
        setUser((prev) => {
            const updated = prev ? { ...prev, ...updates } : prev;
            AsyncStorage.setItem("user", JSON.stringify(updated)); // 👈 persist updates
            return updated;
        });
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Login failed");
            }

            const data = await res.json();
            saveSession(data.user, data.tokens);
            return data.user;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Register failed");
            }

            const data = await res.json();
            saveSession(data.user, data.tokens);
            return data.user;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setUser(null);
        setTokens(null);
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("tokens");
    };

    return (
        <Ctx.Provider value={{ user, tokens, loading, login, register, logout, updateUser }}>
            {children}
        </Ctx.Provider>
    );
};

export const useAuth = () => useContext(Ctx);
