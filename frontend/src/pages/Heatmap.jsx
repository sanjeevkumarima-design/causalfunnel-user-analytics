import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { truncateUrl } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { MapPin, MousePointer2, Search } from 'lucide-react';

const Heatmap = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [heatmapData, setHeatmapData] = useState([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoadingPages(true);
      setError(null);
      const response = await apiService.getPagesWithClicks();
      setPages(response.data.data);
      
      if (response.data.data.length > 0) {
        setSelectedPage(response.data.data[0].page_url);
      }
    } catch (err) {
      setError(err.message || 'Failed to load pages');
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    if (selectedPage) {
      fetchHeatmapData(selectedPage);
    }
  }, [selectedPage]);

  const fetchHeatmapData = async (pageUrl) => {
    try {
      setLoadingHeatmap(true);
      setError(null);
      const response = await apiService.getHeatmapData(pageUrl);
      setHeatmapData(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load heatmap data');
    } finally {
      setLoadingHeatmap(false);
    }
  };

  const handlePageChange = (e) => {
    setSelectedPage(e.target.value);
  };

  if (loadingPages) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchPages} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Click Heatmap</h2>
        <p className="text-gray-500 mt-1">Visualize user click patterns across pages</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-primary-500" />
            <label className="font-medium text-gray-700">Select Page:</label>
          </div>
          
          <div className="flex-1 w-full sm:w-auto">
            <select
              value={selectedPage}
              onChange={handlePageChange}
              className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              {pages.map((page, index) => (
                <option key={index} value={page.page_url}>
                  {truncateUrl(page.page_url, 60)} ({page.click_count} clicks)
                </option>
              ))}
            </select>
          </div>

          {loadingHeatmap && (
            <LoadingSpinner size="sm" />
          )}
        </div>
      </div>

      {loadingHeatmap ? (
        <div className="card">
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="xl" />
          </div>
        </div>
      ) : heatmapData.length > 0 ? (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MousePointer2 size={20} className="text-primary-500" />
              Click Distribution
            </h3>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{heatmapData.length}</span> clicks on this page
            </div>
          </div>

          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-10 grid-rows-10 h-full">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="border border-gray-400"></div>
                ))}
              </div>
            </div>

            {heatmapData.map((click, index) => {
              const x = Math.min(Math.max(click.x, 0), 100);
              const y = Math.min(Math.max(click.y, 0), 100);
              
              return (
                <div
                  key={index}
                  className="absolute w-3 h-3 rounded-full bg-red-500 opacity-60 hover:opacity-100 hover:scale-125 transition-all duration-200 cursor-pointer"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`Click at (${click.x}, ${click.y})`}
                />
              );
            })}

            <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-60"></div>
                <span className="text-gray-600">Click Position</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{heatmapData.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Average X Position</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {Math.round(heatmapData.reduce((sum, c) => sum + c.x, 0) / heatmapData.length)}px
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Average Y Position</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {Math.round(heatmapData.reduce((sum, c) => sum + c.y, 0) / heatmapData.length)}px
              </p>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState 
          message="No click data available for the selected page. Make sure the tracker is properly configured on your website."
          icon={MousePointer2}
        />
      )}
    </div>
  );
};

export default Heatmap;
