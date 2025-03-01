import React from 'react';
import { useData } from '../context/DataContext';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { generateInsights } from '../utils/geminiAI';
import toast from 'react-hot-toast';

const InsightsPanel: React.FC = () => {
  const { data, columns, insights, setInsights, loading, setLoading } = useData();

  const handleRefreshInsights = async () => {
    if (!data || data.length === 0) return;
    
    setLoading(true);
    
    try {
      toast.promise(
        generateInsights(data, columns),
        {
          loading: 'Generating new insights...',
          success: (newInsights) => {
            setInsights(newInsights);
            return 'New insights generated!';
          },
          error: 'Failed to generate insights',
        }
      );
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">AI Insights</h2>
        </div>
        <div className="flex flex-col items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-600">Generating insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">AI Insights</h2>
        <button
          onClick={handleRefreshInsights}
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Refresh
        </button>
      </div>
      
      {insights.length === 0 ? (
        <div className="text-center py-10">
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No insights yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload data to get AI-powered insights
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="bg-indigo-50 p-4 rounded-md">
              <div className="flex">
                <Lightbulb className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800">{insight}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;