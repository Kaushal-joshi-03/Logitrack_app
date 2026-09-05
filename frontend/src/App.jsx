import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";

import Tracking from "./pages/Tracking";
import LandingPage from "./pages/LandingPage";
import Services from "./pages/Services";
import Solutions from "./pages/Solutions";
import Network from "./pages/Network";
import Support from "./pages/Support";
import ClientDashboard from "./pages/client/ClientDashboard";
import WarehouseDashboard from "./pages/warehouse/WarehouseDashboard";
import DistributorDashboard from "./pages/DistributorDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminShipments from "./pages/AdminShipments";
import AdminNetwork from "./pages/AdminNetwork";
import AdminAnalytics from "./pages/AdminAnalytics";
import ClientCreateShipment from "./pages/ClientCreateShipment";
import ClientShipments from "./pages/client/ClientShipments";
import ScanPackage from "./pages/warehouse/ScanPackage";
import ReceivePackage from "./pages/warehouse/ReceivePackage";
import WarehousePackages from "./pages/warehouse/WarehousePackages";
import DistributorPackages from "./pages/distributor/DistributorPackages";
import DistributorAssignPackage from "./pages/distributor/DistributorAssignPackage";
import DistributorManageRoutes from "./pages/distributor/DistributorManageRoutes";
import DistributorTrackShipment from "./pages/distributor/DistributorTrackShipment";
import DistributorCreateDistribution from "./pages/distributor/DistributorCreateDistribution";
import DeliveryList from "./pages/delivery/DeliveryList";
import DeliveryScanPackage from "./pages/delivery/DeliveryScanPackage";
import ScrollToTop from "./components/navigation/ScrollToTop";

function App() {
  return (
    <ThemeProvider>
      <Toaster richColors position="top-right" theme="dark" />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LandingPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/network" element={<Network />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/support" element={<Support />} />

            {/* Protected Client Routes */}
            <Route
              path="/client-dashboard"
              element={
                <ProtectedRoute allowedRoles={["client", "admin"]}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client"
              element={
                <ProtectedRoute allowedRoles={["client", "admin"]}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/create-shipment"
              element={
                <ProtectedRoute allowedRoles={["client", "admin"]}>
                  <ClientCreateShipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/shipments"
              element={
                <ProtectedRoute allowedRoles={["client", "admin"]}>
                  <ClientShipments />
                </ProtectedRoute>
              }
            />

            {/* Protected Warehouse Routes */}
            <Route
              path="/warehouse-dashboard"
              element={
                <ProtectedRoute allowedRoles={["warehouse", "admin"]}>
                  <WarehouseDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/warehouse"
              element={
                <ProtectedRoute allowedRoles={["warehouse", "admin"]}>
                  <WarehouseDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/warehouse/scan"
              element={
                <ProtectedRoute allowedRoles={["warehouse", "admin"]}>
                  <ScanPackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/warehouse/receive"
              element={
                <ProtectedRoute allowedRoles={["warehouse", "admin"]}>
                  <ReceivePackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/warehouse/packages"
              element={
                <ProtectedRoute allowedRoles={["warehouse", "admin"]}>
                  <WarehousePackages />
                </ProtectedRoute>
              }
            />

            {/* Protected Distributor Routes */}
            <Route
              path="/distributor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["distributor", "admin"]}>
                  <DistributorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/distributor"
              element={
                <ProtectedRoute allowedRoles={["distributor", "admin"]}>
                  <DistributorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/distributor/packages"
              element={
                <ProtectedRoute allowedRoles={["distributor", "admin"]}>
                  <DistributorPackages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/distributor/assign"
              element={
                <ProtectedRoute allowedRoles={["distributor", "admin"]}>
                  <DistributorAssignPackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/distributor/routes"
              element={
                <ProtectedRoute allowedRoles={["distributor", "admin"]}>
                  <DistributorManageRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/distributor/track"
              element={
                <ProtectedRoute allowedRoles={["distributor", "admin"]}>
                  <DistributorTrackShipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/distributor/create"
              element={
                <ProtectedRoute allowedRoles={["distributor", "admin"]}>
                  <DistributorCreateDistribution />
                </ProtectedRoute>
              }
            />
            <Route
              path="/distributor/create-distribution"
              element={
                <ProtectedRoute allowedRoles={["distributor", "admin"]}>
                  <DistributorCreateDistribution />
                </ProtectedRoute>
              }
            />

            {/* Protected Delivery Routes */}
            <Route
              path="/delivery-dashboard"
              element={
                <ProtectedRoute allowedRoles={["delivery", "admin"]}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <ProtectedRoute allowedRoles={["delivery", "admin"]}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery/deliveries"
              element={
                <ProtectedRoute allowedRoles={["delivery", "admin"]}>
                  <DeliveryList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery/scan"
              element={
                <ProtectedRoute allowedRoles={["delivery", "admin"]}>
                  <DeliveryScanPackage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/shipments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminShipments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/network"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminNetwork />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;