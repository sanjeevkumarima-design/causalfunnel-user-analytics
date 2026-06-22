import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { formatNumber } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Users, Eye, MousePointer2, TrendingUp, Activity } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResponse, sessionsResponse] = await Promise.all([
        apiService.getStats(),
        apiService.getAllSessions()
      ]);

      setStats(statsResponse.data.data);
      setRecentSessions(sessionsResponse.data.data.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const activityChartData = {
    labels: ['Page Views', 'Clicks', 'Sessions'],
    datasets: [
      {
        label: 'Activity Metrics',
        data: [stats.total_page_views, stats.total_clicks, stats.total_sessions],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgba(14, 165, 233, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const doughnutChartData = {
    labels: ['Page Views', 'Clicks'],
    datasets: [
      {
        data: [stats.total_page_views, stats.total_clicks],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(14, 165, 233, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  const statCards = [
    {
      title: 'Total Sessions',
      value: formatNumber(stats.total_sessions),
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Page Views',
      value: formatNumber(stats.total_page_views),
      icon: Eye,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Clicks',
      value: formatNumber(stats.total_clicks),
      icon: MousePointer2,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Unique Pages',
      value: formatNumber(stats.unique_pages),
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-4 rounded-lg`}>
                <card.icon size={24} className={card.textColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Overview</h3>
          <div className="h-64">
            <Bar data={activityChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Page Views vs Clicks</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={doughnutChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Activity size={20} />
            Recent Sessions
          </h3>
        </div>

        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800 font-mono text-sm">
                    {session.session_id}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {session.total_events} events • {session.page_count} pages
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(session.first_event_time).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent sessions
          </div>
        )}
      </div>

      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium">Recent Activity (24h)</p>
            <p className="text-3xl font-bold mt-2">{formatNumber(stats.recent_events_24h)} events</p>
          </div>
          <Activity size={48} className="text-primary-200" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
