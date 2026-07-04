import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ message = 'No data found', description = 'Nothing to display here yet.' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#1e293b] flex items-center justify-center mb-4">
      <FiInbox size={28} className="text-slate-500" />
    </div>
    <h3 className="text-white font-semibold text-base">{message}</h3>
    <p className="text-slate-500 text-sm mt-1">{description}</p>
  </div>
);

export default EmptyState;
