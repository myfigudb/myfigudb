import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { RequireAuth } from './components/auth/RequireAuth'
import FiguresPage from './pages/FiguresPage'
import FigureDetailsPage from './pages/FigureDetailsPage'
import NotFound from './pages/NotFound'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/figures"
                element={
                    <RequireAuth>
                        <FiguresPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/figures/:figureId"
                element={
                    <RequireAuth>
                        <FigureDetailsPage />
                    </RequireAuth>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App
