import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { PullRequest } from '../../data/mockData';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PRTimelineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: {
        x: string;
        y: number;
        pr: PullRequest;
      }[];
      backgroundColor: string[];
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

// Custom tooltip that shows PR details
const getTooltip = (context: any) => {
  if (!context.raw || !context.raw.pr) return '';
  
  const pr = context.raw.pr;
  
  let status = '';
  let statusColor = '';
  
  switch(pr.status) {
    case 'merged':
      status = 'Merged';
      statusColor = '#8B5CF6';
      break;
    case 'closed':
      status = 'Closed';
      statusColor = '#EF4444';
      break;
    case 'open':
      status = 'Open';
      statusColor = '#3B82F6';
      break;
  }
  
  return `
    <div style="padding: 8px; max-width: 300px; font-family: system-ui;">
      <div style="font-weight: 600; margin-bottom: 4px; color: ${statusColor};">
        #${pr.number} - ${status}
      </div>
      <div style="font-weight: 500; margin-bottom: 8px;">
        ${pr.title}
      </div>
      <div style="color: #666; font-size: 12px; display: flex; justify-content: space-between;">
        <span>Comments: ${pr.comments}</span>
        <span>+${pr.additions} / -${pr.deletions}</span>
      </div>
    </div>
  `;
};

const PRTimelineChart: React.FC<PRTimelineChartProps> = ({ data }) => {
  const chartRef = useRef<ChartJS>(null);

  useEffect(() => {
    // Cleanup function to destroy the chart when component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM d'
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Pull Requests'
        },
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Pull Request Timeline'
      },
      tooltip: {
        enabled: false,
        external: ({ chart, tooltip }: { chart: any, tooltip: any }) => {
          let tooltipEl = document.getElementById('chartjs-tooltip');
          
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<table></table>';
            document.body.appendChild(tooltipEl);
          }
          
          // Hide if no tooltip
          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = '0';
            return;
          }
          
          // Set content
          if (tooltip.body) {
            const dataPoint = tooltip.dataPoints[0];
            if (dataPoint && dataPoint.raw) {
              tooltipEl.innerHTML = getTooltip(dataPoint);
            }
          }
          
          // Set position
          const position = chart.canvas.getBoundingClientRect();
          tooltipEl.style.opacity = '1';
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = position.left + window.scrollX + tooltip.caretX + 'px';
          tooltipEl.style.top = position.top + window.scrollY + tooltip.caretY + 'px';
          tooltipEl.style.pointerEvents = 'none';
          tooltipEl.style.backgroundColor = 'white';
          tooltipEl.style.borderRadius = '4px';
          tooltipEl.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
          tooltipEl.style.transform = 'translate(-50%, calc(-100% - 10px))';
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest' as const
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line ref={chartRef} options={options} data={data} />
    </div>
  );
};

export default PRTimelineChart;