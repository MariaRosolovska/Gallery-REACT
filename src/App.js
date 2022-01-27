import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getImages();
    //eslint-disable-next-line
  }, [page]);

  function getImages() {
    let apiUrl = 'https://api.unsplash.com/photos/?';
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${accessKey}`;

    fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const imagesFromApi = data.results ?? data;

      if (page === 1) {
        setImages(imagesFromApi);
        return;
      }

      setImages((images) => [...images, ...imagesFromApi]);
    })
  }

  function searchImages(e) {
    e.preventDefault();
    setPage(1);
    getImages();
  }

  if (!accessKey) {
    return(
      <a href='https://unsplash.com/documentation' className='error'>Required: Get Your Unsplash API Key First</a>
    )
  }

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form onSubmit={searchImages}>
        <input type="text" placeholder="Search Unsplash..." value={query} onChange={(e) => setQuery(e.target.value)}/>
        <button>Search</button>
      </form>

      <InfiniteScroll dataLength={images.length} next={() => setPage((page) => page + 1)}
        hasMore={true} loader={<h4>Loading...</h4>}>
          <div className="image-grid">
            {images.map((image) => (
              <a className="image" key={image.id} href={image.links.html} target='_blank' rel='noopener noreferrer'>
                <img src={image.urls.regular} alt={image.alt_description} />
              </a>
            ))}
          </div>
      </InfiniteScroll>
    </div>
  );
}
