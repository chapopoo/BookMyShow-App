import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import store from './redux/store';
import ProtectedRoute from './pages/ProtectedRoute';
import Admin from './pages/Admin';
import Partner from './pages/Partner';
import SingleMovie from './pages/SingleMovie';
import BookShow from './pages/BookShow';
import Loader from './pages/Loader';
import Forget from './pages/Forget';
import Reset from './pages/Reset'
import Profile from './pages/Profile'

function App() {
  return (
    <Provider store={store}>
      <Loader />
      <BrowserRouter>
        <Routes>
          //Common protected
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          //Admin only
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />

          //Partner only
          <Route
            path="/partner"
            element={
              <ProtectedRoute allowedRoles={["Partner"]}>
                <Partner />
              </ProtectedRoute>
            }
          />

          {/* All logged-in users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["User", "Admin", "Partner"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <SingleMovie />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-show/:id"
            element={
              <ProtectedRoute>
                <BookShow />
              </ProtectedRoute>
            }
          />

          <Route path="/forget" element={<Forget />} />
          <Route path="/reset" element={<Reset />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
