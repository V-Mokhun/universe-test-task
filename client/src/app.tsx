import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./providers/auth-provider";
import { ProtectedRoute } from "./shared/components/protected-route";
import { Layout } from "./shared/components/layout";
import { LoginPage, RegisterPage } from "./pages";
import { ProjectsPage } from "./pages/projects";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/projects" replace />} />

              <Route path="*" element={<Navigate to="/projects" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
