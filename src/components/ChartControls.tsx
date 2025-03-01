import React from 'react';
import { useData } from '../context/DataContext';

const ChartControls: React.FC = () => {
  const { 
    chartTypes, 
    selectedChart, 
    setSelectedChart, 
    columns, 
    xAxis, 
    setXAxis, 
    yAxis, 
    setYAxis 
  } = useData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="chart-type" className="block text-sm font-medium text-gray-700 mb-1">
          Chart Type
        </label>
        <select
          id="chart-type"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {chartTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Chart
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="x-axis" className="block text-sm font-medium text-gray-700 mb-1">
          X-Axis
        </label>
        <select
          id="x-axis"
          value={xAxis}
          onChange={(e) => setXAxis(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="y-axis" className="block text-sm font-medium text-gray-700 mb-1">
          Y-Axis
        </label>
        <select
          id="y-axis"
          value={yAxis}
          onChange={(e) => setYAxis(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ChartControls;