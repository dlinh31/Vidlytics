import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';

function VideoCard({ info }) {
    const { videoId, title, thumbnailUrl, statistics, publishedAt } = info;

    // Format numbers with commas
    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex flex-col max-w-sm rounded overflow-hidden shadow-lg bg-white h-auto mb-4">
            <img className="w-full object-cover h-48" src={thumbnailUrl} alt={title} />
            <div className="px-6 py-4 flex-1 flex flex-col justify-between">
                <div className="font-bold text-xl mb-2">{title}</div>
                <div className="text-gray-700 text-base mb-4">
                    <div><FontAwesomeIcon icon={faEye} /> {formatNumber(statistics.viewCount)}</div>
                    <div><FontAwesomeIcon icon={faThumbsUp} /> {formatNumber(statistics.likeCount)}</div>
                    <div><FontAwesomeIcon icon={faComment} /> {formatNumber(statistics.commentCount)}</div>
                    <div>Published: {formatDate(publishedAt)}</div>
                </div>
                <a href={`https://www.youtube.com/watch?v=${videoId}`}
                   className="inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-400 w-full text-center"
                   target="_blank" rel="noopener noreferrer">Watch</a>
            </div>
        </div>
    );
}

export default VideoCard;
