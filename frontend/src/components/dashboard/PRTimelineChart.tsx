import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { PullRequestData } from '@10xdevs/shared';

ChartJS.register(
  TimeScale,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TimelinePoint {
  x: string;
  y: number;
  eventType: string;
  pr: PullRequestData;
  details: string;
}

interface PRTimelineChartProps {
  data: PullRequestData[];
}

// Status to color mapping
const getStatusColor = (event: string) => {
  switch (event) {
    case 'created': return '#3B82F6'; // blue
    case 'comment': return '#F59E0B'; // yellow
    case 'approval': return '#10B981'; // green
    case 'commit': return '#8B5CF6'; // purple  
    case 'merged': return '#059669'; // dark green
    case 'closed': return '#EF4444'; // red
    default: return '#6B7280'; // gray
  }
};

// Function to create timeline points for PR
const createTimelinePoints = (pr: PullRequestData, prIndex: number) => {
  const points = [];
  
  // PR creation point
  points.push({
    x: pr.createdAt,
    y: prIndex,
    eventType: 'created',
    pr: pr,
    details: `PR #${pr.number} created`
  });

  // Comment points
  pr.commentsTimeline.forEach(comment => {
    points.push({
      x: comment.date,
      y: prIndex,
      eventType: 'comment',
      pr: pr,
      details: `Comment by ${comment.authorLogin}`
    });
  });

  // Approval points
  pr.approvalsTimeline.forEach(approval => {
    points.push({
      x: approval.date,
      y: prIndex,
      eventType: 'approval',
      pr: pr,
      details: `Approval by ${approval.authorLogin}`
    });
  });

  // Commit points
  pr.commitsTimeline.forEach(commit => {
    points.push({
      x: commit.date,
      y: prIndex,
      eventType: 'commit',
      pr: pr,
      details: `Commit: ${commit.message.substring(0, 50)}...`
    });
  });

  // Closure/merge point
  if (pr.mergedAt) {
    points.push({
      x: pr.mergedAt,
      y: prIndex,
      eventType: 'merged',
      pr: pr,
      details: `PR #${pr.number} merged`
    });
  } else if (pr.closedAt) {
    points.push({
      x: pr.closedAt,
      y: prIndex,
      eventType: 'closed',
      pr: pr,
      details: `PR #${pr.number} closed`
    });
  }

  return points;
};

const PRTimelineChart: React.FC<PRTimelineChartProps> = ({ data }) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Prepare Y-axis labels (PR names) - reversed order for proper display
  const prLabels = data.map(pr => `#${pr.number}: ${pr.title.substring(0, 25)}...`).reverse();
  
  // Group points by event type
  const eventGroups = ['created', 'comment', 'approval', 'commit', 'merged', 'closed'];
  const datasets: any[] = [];

  // Datasets for each event type (without PR background lines)
  eventGroups.forEach(eventType => {
    const eventPoints = data.flatMap((pr, index) => 
      // Reverse index to match reversed label order
      createTimelinePoints(pr, data.length - 1 - index).filter(point => point.eventType === eventType)
    );

    if (eventPoints.length > 0) {
      datasets.push({
        label: eventType.charAt(0).toUpperCase() + eventType.slice(1),
        data: eventPoints,
        backgroundColor: getStatusColor(eventType),
        borderColor: getStatusColor(eventType),
        borderWidth: 2,
        pointRadius: 6,
        showLine: false,
        pointHoverRadius: 8
      });
    }
  });

  // Calculate time range (1 month back from now)
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM d'
          }
        },
        min: oneMonthAgo.toISOString(),
        max: now.toISOString(),
        title: {
          display: true,
          text: 'Date'
        },
        grid: {
          display: true,
          color: '#F3F4F6'
        }
      },
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        min: -0.2,
        max: data.length - 0.8,
        ticks: {
          stepSize: 0.5,
          callback: function(value: any) {
            const numValue = Number(value);
            // Check if value is 0.5 higher than integer (e.g. 0.5, 1.5, 2.5...)
            const index = Math.floor(numValue);
            if (Math.abs(numValue - (index + 0.5)) < 0.1 && index >= 0 && index < prLabels.length) {
              return prLabels[index];
            }
            return '';
          }
        },
        title: {
          display: true,
          text: 'Pull Requests'
        },
        grid: {
          display: true,
          color: '#F3F4F6'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Pull Requests Timeline'
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            const point = context[0]?.raw;
            if (point?.pr) {
              return `PR #${point.pr.number}: ${point.pr.title}`;
            }
            return '';
          },
          label: function(context: any) {
            const point = context.raw;
            if (point?.details) {
              return point.details;
            }
            return '';
          },
          afterLabel: function(context: any) {
            const point = context.raw;
            if (point?.pr) {
              const pr = point.pr;
              const info = [];
              info.push(`Author: ${pr.authorLogin}`);
              info.push(`Status: ${pr.merged ? 'Merged' : pr.state === 'open' ? 'Open' : 'Closed'}`);
              if (pr.commentsTimeline.length > 0) {
                info.push(`Comments: ${pr.commentsTimeline.length}`);
              }
              if (pr.approvalsTimeline.length > 0) {
                info.push(`Approvals: ${pr.approvalsTimeline.length}`);
              }
              return info;
            }
            return [];
          }
        }
      }
    }
  };

  const chartData = {
    datasets: datasets
  };

  return (
    <div style={{ position: 'relative', height: '600px', width: '100%' }}>
      <Scatter ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default PRTimelineChart;