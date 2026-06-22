import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Something went wrong
      </h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
