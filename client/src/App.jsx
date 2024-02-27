import React, { useState, useEffect } from 'react';
import './App.css';
import ChannelInfo from './components/ChannelInfo';
import VideoCard from './components/VideoCard';
import ChannelCard from './components/ChannelCard';
import AppHeader from './components/AppHeader';


function App() {
  const [handle, setHandle] = useState("");
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [sortMethod, setSortMethod] = useState('dateNewest'); 
  const [errorMessage, setErrorMessage] = useState("");
  const [batch, setBatch] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const ENDPOINT = "https://vidlytics.onrender.com/api"

  useEffect(() => {
    const sortedVideos = sortVideos([...videos], sortMethod);
    
    setVideos(sortedVideos);
  }, [sortMethod]); 


  const fetchChannelInfo = async (channelHandle) => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await fetch(`${ENDPOINT}/channel/${channelHandle}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.subscriberCount > 0) {
          return { success: true, data };
        } else {
          return { success: false };
        }
      }
      return { success: false };
    } catch (error) {
      console.error('Fetch error:', error);
      return { success: false };
    }
  };
  
  
  // video sorts method based on different metrics
  function sortVideos(videos, method) {
    return [...videos].sort((a, b) => {
      switch (method) {
        case 'viewsDesc':
          return parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount);
        case 'likesDesc':
          return parseInt(b.statistics.likeCount) - parseInt(a.statistics.likeCount);
        case 'commentsDesc':
          return parseInt(b.statistics.commentCount) - parseInt(a.statistics.commentCount);
        case 'dateNewest':
          return new Date(b.publishedAt) - new Date(a.publishedAt); // Sorting by date descending
        case 'dateOldest':
          return new Date(a.publishedAt) - new Date(b.publishedAt); // Sorting by date ascending
        default:
          return 0;
      }
    });
  }
  




  const fetchVideos = async (channelId) => {
    try {
      const response = await fetch(`${ENDPOINT}/playlist/${channelId}`);
      if (!response.ok) throw new Error('Video data could not be fetched');
      const data = await response.json();
      return sortVideos(data, 'dateNewest');
    } catch (error) {
      console.error('Fetch error:', error);
      throw error; // Rethrow to catch in the batch processing
    }
  };

  const addToBatch = () => {
    if (handle.trim() && !batch.includes(handle)) {
      setBatch([...batch, handle]);
      setHandle(""); // Reset the input field
    }
  };


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 

const processBatch = async () => {
  setVideos([]);
  setChannelInfo(null);
  const results = []; 
  for (const username of batch) {
    try {
      const { success, data } = await fetchChannelInfo(username);
      if (success) {
        const videos = await fetchVideos(data.id);
        results.push({ username, data, videos });
      } else {
        results.push({ username, error: "Channel with given username doesn't exist" });
      }
      // Add a delay to avoid rate limiting, adjust time as needed
      await sleep(1000); 


    } catch (error) {
      console.error('Error processing batch for username:', username, error);
      results.push({ username, error: error.message });
    }
  }
  setBatchResults(results);
  setIsLoading(false);
  setIsLoading(false);
  // Clear the batch if you want to start fresh next time
  setBatch([]);
};


  
  const handleSearch = async () => {
    if (handle.trim()) {
      const { success, data } = await fetchChannelInfo(handle);
      if (success) {
        setChannelInfo(data);
        setErrorMessage(""); // Clear any existing error message
        const videosFromSearch = await fetchVideos(data.id);
        setVideos(videosFromSearch); // Set the fetched videos here
        setIsLoading(false);
        setIsLoading(false);
      } else {
        setErrorMessage("Channel with given username doesn't exist"); // Set the error message
        setChannelInfo(null); // Ensure to clear any existing channel info
        setVideos([]); // Clear any existing videos
      }
    }
  };
  

  // Input field event handler
  const handleInputChange = (event) => {
    setHandle(event.target.value);
  };


  return (
    <div className="space-y-4 mx-8">

    <AppHeader /> 

    <div className="flex flex-col items-center justify-center space-y-2">
    <input
      type="text"
      value={handle}
      onChange={handleInputChange}
      placeholder="Enter YouTube channel username e.g. @MrBeast"
      className="p-2 w-96 border rounded shadow-sm focus:outline-none focus:border-blue-500"
    />
    <div className="flex space-x-4 justify-center">
      <button
        onClick={handleSearch}
        className="w-36 h-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
      <button onClick={addToBatch} className="w-36 h-10 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
        Add to batch
      </button>
      <button onClick={processBatch} className="w-36 h-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Search Batch
      </button>
    </div>
  </div>
      {/* Display all Youtube channels username */}
      <div>
        {batch.map((username, index) => (
          <ChannelCard key={index} username={username} />
        ))}
      </div>

      {/* error message  */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* channel info box  */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      {channelInfo && !errorMessage && (<ChannelInfo info={channelInfo} />)}

      {/* Videos from single channel & sort */}
      {videos.length > 0 && (
        <div className="flex items-center">
          <p className="mr-2">Sort by:</p>
          <select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value)}
            className="p-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="dateNewest">Date (Latest to Oldest)</option>
            <option value="dateOldest">Date (Oldest to Latest)</option>
            <option value="viewsDesc">Views (High to Low)</option>
            <option value="likesDesc">Likes (High to Low)</option>
            <option value="commentsDesc">Comments (High to Low)</option>
            
          </select>
        </div>
      )}
    </div>

    {isLoading && <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>}
      
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {videos.length > 0 && videos.map(video => (
          <VideoCard key={video.id} info={video} />
        ))}
      </div>

      {/* Videos from batch processing  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {batchResults.map((result, index) => (
        <div key={index}>
          <ChannelCard username={result.username} info={result.data} />
          {result.videos && result.videos.map((video, idx) => (
            <VideoCard key={idx} info={video} />
          ))}
          {result.error && <p className="error-message">{result.error}</p>}
        </div>
      ))}
    </div>

    </div>
  );
}

export default App;
