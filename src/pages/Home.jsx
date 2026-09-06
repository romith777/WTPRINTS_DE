import React, { useState, useRef, useContext, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import toast from 'react-hot-toast';
import axios from 'axios';

function Home() {
  const { token, setIsLoading } = useContext(StoreContext);
  const [collection, setCollection] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch user collection on mount
    const fetchCollection = async () => {
      // Stub for now. We will replace with real API call.
      // const res = await axios.get('/api/collection', { headers: { Authorization: `Bearer ${token}` } });
      // setCollection(res.data);
    };
    if (token) fetchCollection();
  }, [token]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }
    if (files.length === 0) return;
    
    // Stub: Normally we'd send these to the backend here via FormData
    toast.success(`${files.length} images queued for upload`);
    
    // Simulate upload
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Upload complete!');
    }, 1500);
  };

  return (
    <main id="main">
      <div className="upload-file">
        <h1 className="heading">Upload New Product</h1>
        <div 
          id="dropbox" 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <img src="/assets/upload.png" alt="upload-img" />
          Drop images here or click (Max* 6)
          <input 
            type="file" 
            id="fileinput" 
            accept="image/*" 
            multiple 
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>
      </div>
      <div className="user-collection">
        <div className="user-collection-content">
          <h1 className="heading">Your Collection</h1>
          <div className="collection">
            {collection.length === 0 ? (
              <div className="no-products">No Products Found</div>
            ) : (
              <div className="sub-collection">
                {/* Render collection items here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
