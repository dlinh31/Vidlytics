import React from 'react';

function VideoCard({ info }) {
    const { videoId, title, thumbnailUrl, statistics } = info;

    // Function to format numbers with commas
    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white flex flex-col justify-between h-full">
            <img className="w-full" src={thumbnailUrl} alt={title} />
            <div className="px-6 py-4 flex-1">
                <div className="font-bold text-xl mb-2">{title}</div>
                {/* Display formatted statistics */}
                <p className="text-gray-700 text-base">
                    Views: {formatNumber(statistics.viewCount)}
                </p>
                <p className="text-gray-700 text-base">
                    Likes: {formatNumber(statistics.likeCount)}
                </p>
                <p className="text-gray-700 text-base mb-4">
                    Comments: {formatNumber(statistics.commentCount)}
                </p>
            </div>
            <div className="px-6 py-4">
                <a href={`https://www.youtube.com/watch?v=${videoId}`}
                   className="inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-400 w-full text-center"
                   target="_blank" rel="noopener noreferrer">Watch</a>
            </div>
        </div>
    );
}

export default VideoCard;
