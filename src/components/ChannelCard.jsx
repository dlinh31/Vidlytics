function ChannelCard({ username }) {
  return (
    <div className="border bg-blue-100 border-gray-200 rounded shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 ease-in-out text-center w-full">
      <p className="text-lg font-semibold">{username}</p>
      {/* Include more information or controls as needed */}
    </div>
  );
}

export default ChannelCard;
