import { useState } from 'react';
import ChannelInfo from './components/ChannelInfo';

import './App.css';

function App() {
  const [handle, setHandle] = useState(""); // State to store the user's input
  const [channelInfo, setChannelInfo] = useState(null); // State to store the fetched channel info

  // Function to fetch channel information
  const fetchChannelInfo = async () => {
    if (handle.trim()) { // Check if handle is not just empty spaces
      try {
        const response = await fetch(`http://localhost:3001/api/channel/${handle}`);
        if (!response.ok) {
          throw new Error('Channel data could not be fetched');
        }
        const data = await response.json();
        setChannelInfo(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setChannelInfo(null); // Reset channel info on error
      }
    }
  };

  return (
    <div className="space-y-4 mx-8">
      <input
        type="text"
        value={handle}
        onChange={(e) => setHandle(e.target.value)} // Update handle state on every keystroke
        placeholder="Enter YouTube channel or username"
        className="w-64 p-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={fetchChannelInfo} // Fetch channel info when the button is clicked
        className="mx-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Search
      </button>

      {/* Render ChannelInfo component only if channelInfo is not null */}
      {channelInfo && <ChannelInfo info={channelInfo} />}
    </div>
  );
}

export default App;
