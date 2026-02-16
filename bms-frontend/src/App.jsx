import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux';
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import store from './redux/store.js';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import Admin from './pages/Admin.jsx';
import Partner from './pages/Partner.jsx';
import SingleMovie from './pages/SingleMovie.jsx';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/partner" element={<ProtectedRoute><Partner/></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Admin/></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie/:id" element={<ProtectedRoute><SingleMovie/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
