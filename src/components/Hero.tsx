
import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2100&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2100&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2100&q=80',
  ];

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      {/* Background images with crossfade */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-center bg-cover"
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === currentImageIndex ? 1 : 0,
            }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-white container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge badge-accent mb-6">Find Your Dream Property</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover Your Perfect Place to Live
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Explore our curated selection of homes, apartments, and land for sale or rent
          </p>

          {/* Search form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-5 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for a location..."
                    className="w-full h-12 pl-11 pr-4 rounded-lg bg-white/80 backdrop-blur-sm border border-white/30 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <MapPin className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              <button className="h-12 px-6 rounded-lg bg-accent hover:bg-accent/90 text-white font-medium flex items-center justify-center transition-colors">
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6">
            <div className="text-center">
              <p className="text-3xl font-bold">2,500+</p>
              <p className="text-white/70 text-sm mt-1">Properties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">1,800+</p>
              <p className="text-white/70 text-sm mt-1">Happy Clients</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">200+</p>
              <p className="text-white/70 text-sm mt-1">Locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
