
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TenantProvider } from "./contexts/TenantContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import ManagerDashboard from "./pages/ManagerDashboard";
import ViewerDashboard from "./pages/ViewerDashboard";
import AnalyticsDetail from "./pages/AnalyticsDetail";
import NotFound from "./pages/NotFound";
import Demo from "./pages/Demo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <TenantProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/demo" element={<Demo />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AppLayout><Index /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AppLayout><Settings /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AppLayout><Users /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manager-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <AppLayout><ManagerDashboard /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/viewer-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['viewer']}>
                    <AppLayout><ViewerDashboard /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics/:metric" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AppLayout><AnalyticsDetail /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TenantProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
