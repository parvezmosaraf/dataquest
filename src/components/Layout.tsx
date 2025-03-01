import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Upload, Home as HomeIcon, Github } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Gemini Data Analyzer</span>
          </Link>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <nav className="mt-5 px-2">
            <Link 
              to="/" 
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                location.pathname === '/' 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <HomeIcon className="mr-3 h-6 w-6 flex-shrink-0" />
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                location.pathname === '/dashboard' 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="mr-3 h-6 w-6 flex-shrink-0" />
              Dashboard
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Gemini Data Analyzer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;