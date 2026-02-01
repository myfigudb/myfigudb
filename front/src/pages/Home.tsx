import { useUserStore } from '../store/userStore'

export default function Home() {
    const user = useUserStore((s) => s.user)
    const setUser = useUserStore((s) => s.setUser)
    const logout = useUserStore((s) => s.logout)

    return (
        <div>
            <h1>Home</h1>

            {user ? (
                <>
                    <p>Connecté : {user.name}</p>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <button onClick={() => setUser({ id: '1', name: 'Ewen' })}>
                    Login fake
                </button>
            )}
        </div>
    )
}
