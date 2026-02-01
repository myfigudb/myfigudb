import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const login = useAuthStore((s) => s.login)
    const isLoading = useAuthStore((s) => s.isLoading)
    const error = useAuthStore((s) => s.error)

    return (
        <div>
            <h1>Login</h1>

            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />

            <button
                disabled={isLoading}
                onClick={() => login({ email, password })}
            >
                {isLoading ? '...' : 'Se connecter'}
            </button>

            {error && <p>{error}</p>}
        </div>
    )
}
