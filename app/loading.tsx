export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex space-x-2 justify-center items-center">
          <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
}
