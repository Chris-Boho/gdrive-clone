import React, { ReactNode, useContext, useEffect, useState } from 'react'
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
    UserCredential, User, sendPasswordResetEmail, updateEmail, updatePassword
} from 'firebase/auth';
import { auth } from '../firebase'

interface authProps {
    children?: ReactNode
}

type AuthContextType = {
    currentUser: User | null;
    signup: (email: string, password: string) => Promise<UserCredential>;
    login: (email: string, password: string) => Promise<UserCredential>;
    logout: () => void;
    resetPassword: (email: string) => Promise<void>;
    changeEmail: (email: string) => Promise<void>;
    changePassword: (password: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export function useAuth() {
    return useContext(AuthContext as React.Context<AuthContextType>)
}

export function AuthProvider({ children }: authProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    function signup(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    function resetPassword(email: string) {
        return sendPasswordResetEmail(auth, email)
    }

    function changeEmail(email: string) {
        return updateEmail(auth.currentUser!, email)
    }

    function changePassword(password: string) {
        return updatePassword(auth.currentUser!, password)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const cur_value: AuthContextType = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        changeEmail,
        changePassword,
    }

    return (
        <AuthContext.Provider value={cur_value}>
            {/* if not loading, then render children */}
            {!loading && children}
        </AuthContext.Provider>
    )
}
