import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { formatDate, formatDuration, truncateUrl } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { Search, ChevronLeft, ChevronRight, Clock, Activity } from 'lucide-react';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [searchTerm, sessions]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllSessions();
      setSessions(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    if (!searchTerm) {
      setFilteredSessions(sessions);
      return;
    }

    const filtered = sessions.filter(session =>
      session.session_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSessions(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSessions} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Sessions</h2>
          <p className="text-gray-500 mt-1">
            {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by session ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {currentSessions.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Session ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Events
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pages
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentSessions.map((session, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-800">
                        {truncateUrl(session.session_id, 20)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-primary-500" />
                        <span className="text-sm text-gray-600">{session.total_events}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{session.page_count}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(session.first_event_time)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(session.last_event_time)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {formatDuration(session.session_duration)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/sessions/${session.session_id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View Journey
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredSessions.length)} of {filteredSessions.length} sessions
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors duration-200
                        ${currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState message="No sessions found matching your search criteria." />
      )}
    </div>
  );
};

export default Sessions;
