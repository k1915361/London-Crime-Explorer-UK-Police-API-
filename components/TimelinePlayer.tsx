import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimelinePlayerProps {
    currentDate: string; // Format: 'YYYY-MM'
    onDateChange: (newDate: string) => void;
    disabled?: boolean;
}

// Generate the last 3 years of months for the timeline
const generateMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 36; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        months.push(`${year}-${month}`);
    }
    return months;
};

const AVAILABLE_MONTHS = generateMonths();

const TimelinePlayer: React.FC<TimelinePlayerProps> = ({ currentDate, onDateChange, disabled }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const currentIndex = AVAILABLE_MONTHS.indexOf(currentDate);
    const isValidDate = currentIndex !== -1;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && isValidDate) {
            interval = setInterval(() => {
                const nextIndex = AVAILABLE_MONTHS.indexOf(currentDate) + 1;
                if (nextIndex < AVAILABLE_MONTHS.length) {
                    onDateChange(AVAILABLE_MONTHS[nextIndex]);
                } else {
                    setIsPlaying(false); // Stop at the end
                }
            }, 3000); // 3 seconds per frame to allow fetching/rendering
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentDate, onDateChange, isValidDate]);

    const handlePlayPause = () => {
        if (!isValidDate) return;

        // If at the very end, and they click play, loop back to the start
        if (!isPlaying && currentIndex === AVAILABLE_MONTHS.length - 1) {
            onDateChange(AVAILABLE_MONTHS[0]);
        }

        setIsPlaying(!isPlaying);
    };

    const handleStep = (direction: 'forward' | 'backward') => {
        if (!isValidDate) return;
        const step = direction === 'forward' ? 1 : -1;
        const newIndex = currentIndex + step;

        if (newIndex >= 0 && newIndex < AVAILABLE_MONTHS.length) {
            onDateChange(AVAILABLE_MONTHS[newIndex]);
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const index = parseInt(e.target.value, 10);
        onDateChange(AVAILABLE_MONTHS[index]);
    };

    if (!isValidDate) {
        // If the user manually typed a date not in our standard 3-year timeline
        return null;
    }

    return (
        <div className="flex flex-col gap-2 w-full p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time Series Analysis</span>
                <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">{currentDate}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handleStep('backward')}
                        disabled={disabled || currentIndex === 0}
                        aria-label="Step backward one month"
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 transition-colors"
                    >
                        <SkipBack size={16} aria-hidden="true" />
                    </button>

                    <button
                        onClick={handlePlayPause}
                        disabled={disabled}
                        aria-label={isPlaying ? "Pause timeline" : "Play timeline"}
                        className={`p-2 rounded-full transition-colors ${isPlaying
                            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                            } disabled:opacity-50`}
                    >
                        {isPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} className="ml-0.5" aria-hidden="true" />}
                    </button>

                    <button
                        onClick={() => handleStep('forward')}
                        disabled={disabled || currentIndex === AVAILABLE_MONTHS.length - 1}
                        aria-label="Step forward one month"
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 transition-colors"
                    >
                        <SkipForward size={16} aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1">
                    <input
                        type="range"
                        min="0"
                        max={AVAILABLE_MONTHS.length - 1}
                        value={currentIndex}
                        onChange={handleSliderChange}
                        disabled={disabled}
                        aria-label="Timeline progress pointer"
                        className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700 accent-indigo-600 dark:accent-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default TimelinePlayer;
