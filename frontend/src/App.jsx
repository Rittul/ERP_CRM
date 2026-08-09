import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Customers from './components/Customers'
import Products from './components/Products'
import Inventory from './components/Inventory'
import Challans from './components/Challans'
import Layout from './components/Layout'
import Documentation from "./components/Documentation";
function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Auth />} />
      <Route path="/documentation" element={<Documentation />} />

      {/* Protected routes — all wrapped in Layout (sidebar + content) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard"  element={<Dashboard />}  />
        <Route path="/customers"  element={<Customers />}  />
        <Route path="/products"   element={<Products />}   />
        <Route path="/inventory"  element={<Inventory />}  />
        <Route path="/challans"   element={<Challans />}   />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
