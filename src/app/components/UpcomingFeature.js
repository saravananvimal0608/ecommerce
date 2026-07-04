import { FiClock, FiZap } from 'react-icons/fi';

const UpcomingFeature = ({ title = 'Coming Soon', description = 'This feature is currently under development and will be available soon.', badge = 'Upcoming Feature' }) => (
  <div className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6">
    <div className="max-w-md w-full text-center">
      {/* Glow ring */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full bg-violet-500/10 animate-ping" />
        <div className="absolute w-24 h-24 rounded-full bg-violet-500/15" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
          <FiClock size={36} className="text-white" />
        </div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
        <FiZap size={11} />
        {badge}
      </div>

      <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-8">{description}</p>

      {/* Progress bar decoration */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-xs font-medium">Development Progress</span>
          <span className="text-violet-400 text-xs font-bold">In Progress</span>
        </div>
        <div className="w-full bg-[#1e293b] rounded-full h-2 overflow-hidden">
          <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 w-[45%] relative">
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-slate-600 text-xs">Design</span>
          <span className="text-slate-600 text-xs">Development</span>
          <span className="text-slate-600 text-xs">Launch</span>
        </div>
      </div>
    </div>
  </div>
);

export default UpcomingFeature;
