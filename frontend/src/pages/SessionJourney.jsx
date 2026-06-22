import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { formatDate, truncateUrl } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { ArrowLeft, Eye, MousePointer2, Clock, ExternalLink } from 'lucide-react';

const SessionJourney = () => {
  const { sessionId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessionEvents();
  }, [sessionId]);

  const fetchSessionEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSessionById(sessionId);
      setEvents(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load session events');
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
    return <ErrorMessage message={error} onRetry={fetchSessionEvents} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/sessions"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back to Sessions</span>
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Session Journey</h2>
            <p className="text-gray-500 mt-1 font-mono text-sm">
              {sessionId}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{events.length} events</span>
            </div>
          </div>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Event Timeline</h3>
          
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {events.map((event, index) => (
                <div key={index} className="relative flex gap-4">
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${event.event_type === 'page_view' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                      }`}>
                      {event.event_type === 'page_view' ? (
                        <Eye size={20} />
                      ) : (
                        <MousePointer2 size={20} />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${event.event_type === 'page_view' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                            }`}>
                            {event.event_type === 'page_view' ? 'PAGE VIEW' : 'CLICK'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                      </div>

                      {event.event_type === 'page_view' ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Page URL:</p>
                          <a
                            href={event.page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                          >
                            {truncateUrl(event.page_url, 60)}
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Click Coordinates:</p>
                          <div className="flex items-center gap-4">
                            <div className="bg-white px-3 py-2 rounded border">
                              <span className="text-xs text-gray-500">X:</span>
                              <span className="ml-2 font-mono text-sm">{event.click.x}</span>
                            </div>
                            <div className="bg-white px-3 py-2 rounded border">
                              <span className="text-xs text-gray-500">Y:</span>
                              <span className="ml-2 font-mono text-sm">{event.click.y}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Page URL:</p>
                          <a
                            href={event.page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                          >
                            {truncateUrl(event.page_url, 60)}
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState message="No events found for this session." />
      )}
    </div>
  );
};

export default SessionJourney;
