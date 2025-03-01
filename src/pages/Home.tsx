import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useData } from '../context/DataContext';
import { parseFile } from '../utils/fileParser';
import { generateInsights } from '../utils/geminiAI';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setData, 
    setColumns, 
    setFileName, 
    setInsights, 
    setLoading, 
    setError,
    setXAxis,
    setYAxis
  } = useData();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setFileName(file.name);
    setLoading(true);
    setError(null);
    
    try {
      // Parse the file
      const { data, columns } = await parseFile(file);
      
      if (!data || data.length === 0) {
        throw new Error('No data found in the file');
      }
      
      setData(data);
      setColumns(columns);
      
      // Set default axes if columns exist
      if (columns.length > 0) {
        setXAxis(columns[0]);
        if (columns.length > 1) {
          setYAxis(columns[1]);
        } else {
          setYAxis(columns[0]);
        }
      }
      
      // Generate insights using Gemini AI
      toast.promise(
        generateInsights(data, columns),
        {
          loading: 'Analyzing data with Gemini AI...',
          success: (insights) => {
            setInsights(insights);
            navigate('/dashboard');
            return 'Analysis complete!';
          },
          error: (err) => {
            setError(err.message);
            return `Analysis failed: ${err.message}`;
          }
        }
      );
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error processing file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [navigate, setData, setColumns, setFileName, setInsights, setLoading, setError, setXAxis, setYAxis]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Analyze Your Data with Gemini AI
        </h1>
        <p className="text-xl text-gray-600">
          Upload your dataset and get AI-powered insights and visualizations instantly
        </p>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-medium text-gray-700">
          {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Supported formats: JSON, CSV, Excel (.xlsx, .xls)
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        <FeatureCard 
          icon={<FileJson className="h-8 w-8 text-indigo-600" />}
          title="JSON Files"
          description="Upload structured JSON data for analysis and visualization"
        />
        <FeatureCard 
          icon={<FileSpreadsheet className="h-8 w-8 text-indigo-600" />}
          title="Excel Files"
          description="Import Excel spreadsheets (.xlsx, .xls) with multiple sheets"
        />
        <FeatureCard 
          icon={<FileText className="h-8 w-8 text-indigo-600" />}
          title="CSV Files"
          description="Analyze comma-separated values files with headers"
        />
      </div>

      <div className="mt-16 bg-indigo-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How It Works
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>Upload your dataset (JSON, CSV, or Excel format)</li>
          <li>Our system processes and cleans your data automatically</li>
          <li>Gemini AI analyzes your data to identify patterns and insights</li>
          <li>Explore interactive visualizations and AI-generated insights</li>
          <li>Export or share your findings as needed</li>
        </ol>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default Home;