import { RefreshCw } from 'lucide-react';

const Header = ({ onRefresh, lastUpdated }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
        
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
