// Save this as InfiniteScroll.js in the same directory as index.js
import { useState, useEffect } from 'react';

const InfiniteScroll = ({ 
  loadMore,
  hasMore = false,
  loading = false,
  threshold = 200,
  loader = <div className="text-center p-4">Loading more items...</div>,
  endMessage = <div className="text-center p-4">You've reached the end!</div>,
  children 
}) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = () => {
    // Calculate distance from bottom of page
    const scrollTop = Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    
    const clientHeight = document.documentElement.clientHeight;
    
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // If we're within the threshold and not already loading, trigger loadMore
    if (distanceFromBottom <= threshold && !loading && hasMore && !isFetching) {
      setIsFetching(true);
      loadMore();
    }
  };

  // Reset isFetching when loading state changes
  useEffect(() => {
    if (!loading) {
      setIsFetching(false);
    }
  }, [loading]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, isFetching]);

  return (
    <>
      {children}
      {loading && loader}
      {!hasMore && !loading && endMessage}
    </>
  );
};

export default InfiniteScroll;

// index.js - Your main React application entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // If you have one

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// App.js - Your main application component
// Example component using the InfiniteScroll
const App = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchItems = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`https://api.example.com/items?page=${page}`);
      const data = await response.json();
      
      if (data.items.length === 0) {
        setHasMore(false);
      } else {
        setItems(prevItems => [...prevItems, ...data.items]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchItems();
  }, []);

  const loadMoreItems = () => {
    fetchItems();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Infinite Scroll Example</h1>
      
      <InfiniteScroll
        loadMore={loadMoreItems}
        hasMore={hasMore}
        loading={loading}
        threshold={200}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default App;