import React, { useEffect, useRef } from 'react';
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

interface PRTimelineChartProps {
  data: PullRequestData[];
}

// Mapowanie statusów na kolory
const getStatusColor = (event: string) => {
  switch (event) {
    case 'created': return '#3B82F6'; // niebieski
    case 'comment': return '#F59E0B'; // żółty
    case 'approval': return '#10B981'; // zielony
    case 'commit': return '#8B5CF6'; // fioletowy  
    case 'merged': return '#059669'; // ciemnozielony
    case 'closed': return '#EF4444'; // czerwony
    default: return '#6B7280'; // szary
  }
};

// Funkcja do tworzenia punktów czasowych dla PR
const createTimelinePoints = (pr: PullRequestData, prIndex: number) => {
  const points = [];
  
  // Punkt utworzenia PR
  points.push({
    x: pr.createdAt,
    y: prIndex,
    eventType: 'created',
    pr: pr,
    details: `PR #${pr.number} utworzone`
  });

  // Punkty komentarzy
  pr.commentsTimeline.forEach(comment => {
    points.push({
      x: comment.date,
      y: prIndex,
      eventType: 'comment',
      pr: pr,
      details: `Komentarz od ${comment.authorLogin}`
    });
  });

  // Punkty approval
  pr.approvalsTimeline.forEach(approval => {
    points.push({
      x: approval.date,
      y: prIndex,
      eventType: 'approval',
      pr: pr,
      details: `Approval od ${approval.authorLogin}`
    });
  });

  // Punkty commitów
  pr.commitsTimeline.forEach(commit => {
    points.push({
      x: commit.date,
      y: prIndex,
      eventType: 'commit',
      pr: pr,
      details: `Commit: ${commit.message.substring(0, 50)}...`
    });
  });

  // Punkt zamknięcia/zmergowania
  if (pr.mergedAt) {
    points.push({
      x: pr.mergedAt,
      y: prIndex,
      eventType: 'merged',
      pr: pr,
      details: `PR #${pr.number} zmergowane`
    });
  } else if (pr.closedAt) {
    points.push({
      x: pr.closedAt,
      y: prIndex,
      eventType: 'closed',
      pr: pr,
      details: `PR #${pr.number} zamknięte`
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

  // Przygotowanie etykiet dla osi Y (nazwy PR) - odwrócona kolejność dla poprawnego wyświetlania
  const prLabels = data.map(pr => `#${pr.number}: ${pr.title.substring(0, 25)}...`).reverse();
  
  // Grupowanie punktów według typu zdarzenia
  const eventGroups = ['created', 'comment', 'approval', 'commit', 'merged', 'closed'];
  const datasets: any[] = [];

  // Datasets dla każdego typu zdarzenia (bez linii PR w tle)
  eventGroups.forEach(eventType => {
    const eventPoints = data.flatMap((pr, index) => 
      // Odwracamy indeks aby był zgodny z odwróconą kolejnością etykiet
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

  // Obliczenie zakresu czasowego (1 miesiąc wstecz od teraz)
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
          text: 'Data'
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
            // Sprawdź czy wartość jest o 0.5 wyżej od liczby całkowitej (np. 0.5, 1.5, 2.5...)
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
        text: 'Timeline Pull Requestów'
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
              info.push(`Autor: ${pr.authorLogin}`);
              info.push(`Status: ${pr.merged ? 'Zmergowane' : pr.state === 'open' ? 'Otwarte' : 'Zamknięte'}`);
              if (pr.commentsTimeline.length > 0) {
                info.push(`Komentarze: ${pr.commentsTimeline.length}`);
              }
              if (pr.approvalsTimeline.length > 0) {
                info.push(`Approvale: ${pr.approvalsTimeline.length}`);
              }
              return info;
            }
            return [];
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: false
    }
  };

  return (
    <div className="w-full h-[400px] max-w-full overflow-hidden">
      <Scatter ref={chartRef} options={options} data={{ datasets }} />
    </div>
  );
};

export default PRTimelineChart;