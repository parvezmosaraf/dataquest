import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { DataProvider } from './context/DataContext';
import FloatingChatWidget from './components/FloatingChatWidget';

function App() {
  return (
    <DataProvider>
      <Router>
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
        <FloatingChatWidget />
      </Router>
    </DataProvider>
  );
}

export default App;