import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DataContextType {
  data: any[] | null;
  setData: React.Dispatch<React.SetStateAction<any[] | null>>;
  columns: string[];
  setColumns: React.Dispatch<React.SetStateAction<string[]>>;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  insights: string[];
  setInsights: (insights: string[]) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  chartTypes: string[];
  selectedChart: string;
  setSelectedChart: React.Dispatch<React.SetStateAction<string>>;
  xAxis: string;
  setXAxis: React.Dispatch<React.SetStateAction<string>>;
  yAxis: string;
  setYAxis: React.Dispatch<React.SetStateAction<string>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<string>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');

  const chartTypes = [
    'bar', 
    'line', 
    'pie', 
    'doughnut', 
    'polarArea', 
    'radar', 
    'scatter', 
    'bubble'
  ];

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        columns,
        setColumns,
        fileName,
        setFileName,
        insights,
        setInsights,
        loading,
        setLoading,
        error,
        setError,
        chartTypes,
        selectedChart,
        setSelectedChart,
        xAxis,
        setXAxis,
        yAxis,
        setYAxis,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};