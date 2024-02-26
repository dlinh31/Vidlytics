import React, { useState, useEffect } from 'react';
import './App.css';
import ChannelInfo from './components/ChannelInfo';
import VideoCard from './components/VideoCard';
import ChannelCard from './components/ChannelCard';


function App() {
  const [handle, setHandle] = useState("");
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [sortMethod, setSortMethod] = useState('dateNewest'); 
  const [errorMessage, setErrorMessage] = useState("");
  const [batch, setBatch] = useState([]); // State to hold batch of usernames
  const [batchResults, setBatchResults] = useState([]);

  useEffect(() => {
    const sortedVideos = sortVideos([...videos], sortMethod);
    setVideos(sortedVideos);
  }, [sortMethod]); // React to changes in fetched videos or sort method


  const fetchChannelInfo = async (channelHandle) => {
    try {
      const response = await fetch(`http://localhost:3001/api/channel/${channelHandle}`);
      if (response.ok) {
        const data = await response.json();
        // Check if the data contains valid channel information.
        // Assuming that a valid channel will always have more than 0 subscribers.
        if (data && data.subscriberCount > 0) {
          return { success: true, data };
        } else {
          // If the data is not valid, return success: false.
          return { success: false };
        }
      }
      // If the response is not OK, treat it as a failure to find the channel.
      return { success: false };
    } catch (error) {
      console.error('Fetch error:', error);
      return { success: false }; // Treat errors as failure to find the channel
    }
  };
  
  

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
    const response = await fetch(`http://localhost:3001/api/playlist/${channelId}`);
    if (!response.ok) throw new Error('Video data could not be fetched');
    const data = await response.json();
    return sortVideos(data, 'dateNewest'); // Assuming you want to sort by date as default
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


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); //delay to respect API's rate limit

const processBatch = async () => {
  setVideos([]);
  setChannelInfo(null);
  const results = []; // Array to store results from each username's data fetch
  for (const username of batch) {
    try {
      const { success, data } = await fetchChannelInfo(username);
      if (success) {
        // Assume fetchVideos is modified to return the videos directly
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

  // Do something with the results here
  // For example, you could set them to a state to display in the UI
  setBatchResults(results);
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
      <input
        type="text"
        value={handle}
        onChange={handleInputChange}
        placeholder="Enter YouTube channel username e.g. @MrBeast"
        className="p-2 w-96 border rounded shadow-sm focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleSearch}
        className="w-36 h-10 mx-2 ml-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
      <button onClick={addToBatch} className=" w-36 h-10 mx-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
        Add to batch
      </button>
      <button onClick={processBatch} className="w-36 h-10 mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Search Batch
      </button>
      {/* Display the batch of usernames */}
      <div>
        {batch.map((username, index) => (
          <ChannelCard key={index} username={username} />
        ))}
      </div>


      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      {channelInfo && !errorMessage && (<ChannelInfo info={channelInfo} />)}
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

      

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {videos.length > 0 && videos.map(video => (
          <VideoCard key={video.id} info={video} />
        ))}
      </div>
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
