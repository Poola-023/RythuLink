import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import './index.css'

import Login from './pages/Login'
import BuyerLogin from "./pages/BuyerLogin.jsx";
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadCrop from './pages/UploadCrop'
import Marketplace from './pages/Marketplace'
import AdminDashboard from './pages/AdminDashboard'
import ManageUsers from './pages/ManageUsers'
import ManageCrops from './pages/ManageCrops'
import Reports from './pages/Reports'
import FraudDetection from './pages/FraudDetection'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RythuLinkHomeDemo from "./pages/RythuLinkHomeDemo";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import MyCrops from "./pages/MyCrops.jsx";
import BuyerOrders from "./pages/BuyerOrders.jsx";
import FarmerOrders from "./pages/FarmerOrders.jsx";
import WeatherDashboard from './pages/WeatherDashboard.jsx';
import AIAdvisor from './pages/AIAdvisor.jsx';
import TransportDashboard from "./pages/TransportDashboard.jsx";
import Home from './pages/Home.jsx';
import FarmingProducts from "./pages/FarmingProducts";
import CropDashboard from "./pages/CropDashboard";
import CropKnowledgeCenter from "./pages/CropKnowledgeCenter";
import CropCombinationPlanner from "./pages/CropCombinationPlanner";

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>

    <Routes>
      

      <Route
        path="/"
        element={<RythuLinkHomeDemo />}
      />

      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/buyer-login"
        element={<BuyerLogin />}
      />
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadCrop />
          </ProtectedRoute>
        }
      />

      <Route
        path="/marketplace"
        element={<Marketplace />}
      />
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/users"
        element={<ManageUsers />}
      />

      <Route
        path="/admin/crops"
        element={<ManageCrops />}
      />

      <Route
        path="/admin/reports"
        element={<Reports />}
      />

      <Route
        path="/admin/fraud"
        element={<FraudDetection />}
      />
      <Route
        path="/buyer-dashboard"
        element={<BuyerDashboard />}
      />
      <Route
        path="/my-crops"
        element={<MyCrops />}
      />
      <Route
        path="/buyer-orders"
        element={<BuyerOrders />}
      />
      <Route
        path="/farmer-orders"
        element={<FarmerOrders />}
      />
      <Route
        path="/weather"
        element={<WeatherDashboard />}
      />
      <Route
        path="/ai-advisor"
        element={<AIAdvisor />}
      />
      <Route
        path="/transport"
        element={<TransportDashboard />}
      />
      <Route
        path="/home"
        element={<Home />}
      />
      <Route path="/farming-products" element={<FarmingProducts />} />
      <Route path="/crop-dashboard/:cropId" element={<CropDashboard />} />
      <Route path="/crop-knowledge" element={<CropKnowledgeCenter />} />
      <Route
        path="/crop-combination-planner"
        element={<CropCombinationPlanner />}
      />
    </Routes>

  </BrowserRouter>
)