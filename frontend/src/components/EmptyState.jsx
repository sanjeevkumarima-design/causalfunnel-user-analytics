import { Inbox } from 'lucide-react';

const EmptyState = ({ message, icon: Icon = Inbox }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={64} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">
        No data available
      </h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
