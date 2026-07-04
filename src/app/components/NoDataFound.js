const NoDataFound = ({ message = "No Data Found", color = "text-black" }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">

            {/* Animated SVG illustration */}
            <div className="relative w-48 h-48 mb-8">

                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-ping" />

                {/* Middle rotating dashed ring */}
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-violet-400/40 animate-spin [animation-duration:8s]" />

                {/* Inner glowing circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-violet-900/60 to-slate-800/80 border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center justify-center">

                    {/* Folder SVG with floating animation */}
                    <div className="animate-bounce [animation-duration:2s]">
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Folder body */}
                            <rect x="4" y="16" width="44" height="30" rx="4" fill="#4c1d95" stroke="#7c3aed" strokeWidth="1.5" />
                            {/* Folder tab */}
                            <path d="M4 20V18a2 2 0 012-2h12l4 4H6a2 2 0 00-2 2z" fill="#6d28d9" stroke="#7c3aed" strokeWidth="1" />
                            {/* Question mark */}
                            <text x="26" y="36" textAnchor="middle" fill="#a78bfa" fontSize="16" fontWeight="bold" fontFamily="sans-serif">?</text>
                        </svg>
                    </div>
                </div>

                {/* Floating particles */}
                <div className="absolute top-3 right-5 w-2 h-2 rounded-full bg-violet-400/70 animate-ping [animation-delay:0.5s] [animation-duration:2.5s]" />
                <div className="absolute bottom-6 left-3 w-1.5 h-1.5 rounded-full bg-indigo-400/70 animate-ping [animation-delay:1s] [animation-duration:3s]" />
                <div className="absolute top-10 left-6 w-1 h-1 rounded-full bg-violet-300/60 animate-ping [animation-delay:1.5s] [animation-duration:2s]" />
            </div>

            {/* Animated text */}
            <h3 className={`text-xl font-bold mb-2 animate-pulse ${color}`}>{message}</h3>
            <p className="text-slate-400 text-sm text-center max-w-xs">
                Looks like there&apos;s nothing here yet. Try adjusting your filters or check back later.
            </p>

            {/* Animated bottom dots */}
            <div className="flex gap-2 mt-6">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-violet-500"
                        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                    />
                ))}
            </div>
        </div>
    );
};

export default NoDataFound;
