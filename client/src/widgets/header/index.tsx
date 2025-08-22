import React from "react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/hooks";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              GitHub Projects Manager
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-gray-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
