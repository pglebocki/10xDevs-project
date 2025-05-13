import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">10xDevs Dashboard</h1>
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Welcome to the Developer Dashboard</h2>
        <p className="mb-4">
          This dashboard will help you monitor developer activity on GitHub repositories.
        </p>
        <div className="flex flex-col items-center">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            count is {count}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Click the button to see state working in React
          </p>
        </div>
      </div>
    </div>
  );
}

export default App; 