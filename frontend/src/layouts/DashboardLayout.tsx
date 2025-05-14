import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity, GitBranch } from 'lucide-react';
import { RepositoryProvider } from '../contexts/RepositoryContext';

const DashboardLayout: React.FC = () => {
  return (
    <RepositoryProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Activity className="h-8 w-8 text-blue-500" />
                  <span className="ml-2 text-xl font-bold text-gray-900">DevDashboard</span>
                </div>
                <nav className="ml-6 flex space-x-8">
                  <Link 
                    to="/repositories" 
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    <GitBranch className="mr-1 h-4 w-4" />
                    Repositories
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 text-sm text-gray-500 text-center">
              Developer Activity Dashboard PoC &copy; 2025
            </div>
          </div>
        </footer>
      </div>
    </RepositoryProvider>
  );
};

export default DashboardLayout;