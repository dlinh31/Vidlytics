import { useState } from 'react';

function ChannelInfo({info}) {
    const { title, subscriberCount, videoCount, viewCount } = info;
    return (
        <div className=" w-80 p-5 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-gray-600 mb-2"><span className="font-semibold">Subscribers:</span> {subscriberCount}</p>
          <p className="text-gray-600 mb-2"><span className="font-semibold">Videos:</span> {videoCount}</p>
          <p className="text-gray-600"><span className="font-semibold">Views:</span> {viewCount}</p>
        </div>
      );
}

export default ChannelInfo;
