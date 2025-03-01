import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, RefreshCw, FileDown, BarChart } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import DataVisualizer from '../components/DataVisualizer';
import InsightsPanel from '../components/InsightsPanel';
import ChartControls from '../components/ChartControls';
import Footer from '../components/Footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, fileName, loading, error } = useData();

  useEffect(() => {
    // Redirect to home if no data is loaded
    if (!data && !loading) {
      navigate('/');
    }
  }, [data, loading, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600">Processing your data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-2xl mx-auto">
        <h2 className="text-lg font-medium text-red-800 mb-2">Error</h2>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    const dashboard = document.getElementById('dashboard-content');
    if (!dashboard) return;

    try {
      const canvas = await html2canvas(dashboard);
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName || 'dashboard'}-analysis.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleShare = async () => {
    try {
      const dashboard = document.getElementById('dashboard-content');
      if (!dashboard) return;
      
      const canvas = await html2canvas(dashboard);
      const blob = await new Promise(resolve => canvas.toBlob(resolve));
      
      if (blob && navigator.share) {
        await navigator.share({
          title: `${fileName || 'Dashboard'} Analysis`,
          files: [new File([blob], 'dashboard.png', { type: 'image/png' })],
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const url = canvas.toDataURL();
        const link = document.createElement('a');
        link.download = 'dashboard.png';
        link.href = url;
        link.click();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <BarChart className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 animate-slideDown">
                  {fileName || 'Dataset'} Analysis
                </h1>
                <p className="text-gray-500 mt-1">
                  Analyzing {data?.length || 0} records
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105"
              >
                <FileDown className="h-5 w-5 mr-2" />
                Export PDF
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div id="dashboard-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slideUp">
              <ChartControls />
              <div className="mt-6 h-[400px]">
                <DataVisualizer />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slideUp delay-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Table</h2>
              <DataTable />
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slideUp delay-200">
              <InsightsPanel />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;