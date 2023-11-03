import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

interface privProps {
    children?: ReactNode
}


export default function PrivateRoute({ children }: privProps) {
    const { currentUser } = useAuth()

    return (
        // if we have a current user, then render children else redirect to login
        currentUser! ? children : <Navigate to="/login" />
    )
}
