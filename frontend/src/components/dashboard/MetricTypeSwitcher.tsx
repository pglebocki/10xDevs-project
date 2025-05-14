import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, BarChart2, PieChart, Activity } from 'lucide-react';

interface MetricType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface MetricTypeSwitcherProps {
  repoId: string;
  selected: string;
}

const MetricTypeSwitcher: React.FC<MetricTypeSwitcherProps> = ({ repoId, selected }) => {
  const navigate = useNavigate();
  
  const metricTypes: MetricType[] = [
    {
      id: 'pr-timeline',
      name: 'PR Timeline',
      icon: <LineChart className="h-5 w-5" />
    },
    {
      id: 'code-frequency',
      name: 'Code Frequency',
      icon: <BarChart2 className="h-5 w-5" />
    },
    {
      id: 'contribution-ratio',
      name: 'Contribution Ratio',
      icon: <PieChart className="h-5 w-5" />
    },
    {
      id: 'developer-activity',
      name: 'Developer Activity',
      icon: <Activity className="h-5 w-5" />
    }
  ];
  
  const handleSelect = (metricId: string) => {
    navigate(`/repositories/${repoId}/metrics/${metricId}`);
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {metricTypes.map((metric) => (
          <button
            key={metric.id}
            className={`
              flex items-center px-4 py-3 text-sm font-medium
              ${selected === metric.id 
                ? 'bg-blue-50 text-blue-700 border-b-2 sm:border-b-0 sm:border-l-2 border-blue-500' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              transition-colors duration-200
            `}
            onClick={() => handleSelect(metric.id)}
          >
            <span className="mr-2">{metric.icon}</span>
            {metric.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MetricTypeSwitcher;