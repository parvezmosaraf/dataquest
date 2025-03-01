import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, PolarArea, Radar, Scatter, Bubble } from 'react-chartjs-2';
import { useData } from '../context/DataContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const DataVisualizer: React.FC = () => {
  const { data, selectedChart, xAxis, yAxis } = useData();

  const chartData = useMemo(() => {
    if (!data || !xAxis || !yAxis) return null;

    // Extract data for the selected axes
    const labels = data.map(item => item[xAxis]);
    const values = data.map(item => {
      const val = parseFloat(item[yAxis]);
      return isNaN(val) ? 0 : val;
    });

    // Generate random colors for datasets
    const generateColors = (count: number) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
      }
      return colors;
    };

    const backgroundColor = generateColors(labels.length);
    const borderColor = backgroundColor.map(color => color.replace('0.6', '1'));

    // Basic dataset for most chart types
    const baseDataset = {
      label: yAxis,
      data: values,
      backgroundColor,
      borderColor,
      borderWidth: 1,
    };

    // For scatter and bubble charts
    const scatterData = data.map((item, index) => ({
      x: parseFloat(item[xAxis]) || index,
      y: parseFloat(item[yAxis]) || 0,
      r: 8, // For bubble charts
    }));

    // Return appropriate data structure based on chart type
    switch (selectedChart) {
      case 'pie':
      case 'doughnut':
      case 'polarArea':
        return {
          labels,
          datasets: [{
            ...baseDataset,
            hoverOffset: 4
          }]
        };
      case 'radar':
        return {
          labels,
          datasets: [{
            ...baseDataset,
            fill: true,
          }]
        };
      case 'scatter':
        return {
          datasets: [{
            label: `${xAxis} vs ${yAxis}`,
            data: scatterData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        };
      case 'bubble':
        return {
          datasets: [{
            label: `${xAxis} vs ${yAxis}`,
            data: scatterData,
            backgroundColor: backgroundColor.map(color => color.replace('0.6', '0.4')),
            borderColor,
            borderWidth: 1,
          }]
        };
      default: // bar, line, etc.
        return {
          labels,
          datasets: [baseDataset]
        };
    }
  }, [data, selectedChart, xAxis, yAxis]);

  const chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${yAxis} by ${xAxis}`,
      },
    },
  };

  if (!chartData) {
    return <div className="flex items-center justify-center h-full">Select data to visualize</div>;
  }

  // Render the appropriate chart based on the selected type
  const renderChart = () => {
    switch (selectedChart) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      case 'polarArea':
        return <PolarArea data={chartData} options={chartOptions} />;
      case 'radar':
        return <Radar data={chartData} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={chartData} options={chartOptions} />;
      case 'bubble':
        return <Bubble data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
      {renderChart()}
    </div>
  );
};

export default DataVisualizer;