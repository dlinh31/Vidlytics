import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';

function VideoCard({ info }) {
    const { videoId, title, thumbnailUrl, statistics, publishedAt } = info;

    // Function to format numbers with commas
    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white flex flex-col justify-between h-full">
            <img className="w-full" src={thumbnailUrl} alt={title} />
            <div className="px-6 py-4 flex-1">
                <div className="font-bold text-xl mb-2">{title}</div>
                <div className="text-gray-700 text-base">
                    <div><FontAwesomeIcon icon={faEye} /> {formatNumber(statistics.viewCount)}</div>
                    <div><FontAwesomeIcon icon={faThumbsUp} /> {formatNumber(statistics.likeCount)}</div>
                    <div><FontAwesomeIcon icon={faComment} /> {formatNumber(statistics.commentCount)}</div>
                    {/* Display the formatted published date */}
                    <div>Published: {formatDate(publishedAt)}</div>
                </div>
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
