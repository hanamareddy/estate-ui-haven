import { useState } from 'react';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PropertyGrid from '@/components/PropertyGrid';

const Index = () => {
  // Filter states
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [areaRange, setAreaRange] = useState({ min: '', max: '' });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Filter handlers
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange({ ...priceRange, [type]: value });
  };
  
  const handleAreaChange = (type: 'min' | 'max', value: string) => {
    setAreaRange({ ...areaRange, [type]: value });
  };
  
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };
  
  const resetFilters = () => {
    setActiveStatus('all');
    setActiveType('all');
    setPriceRange({ min: '', max: '' });
    setBedrooms('');
    setBathrooms('');
    setAreaRange({ min: '', max: '' });
    setSelectedAmenities([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" />
      <Navbar 
        activeStatus={activeStatus}
        activeType={activeType}
        priceRange={priceRange}
        bedrooms={bedrooms}
        bathrooms={bathrooms}
        areaRange={areaRange}
        selectedAmenities={selectedAmenities}
        onStatusChange={setActiveStatus}
        onTypeChange={setActiveType}
        handlePriceChange={handlePriceChange}
        setBedrooms={setBedrooms}
        setBathrooms={setBathrooms}
        handleAreaChange={handleAreaChange}
        toggleAmenity={toggleAmenity}
        resetFilters={resetFilters}
      />
      <Hero />
      <PropertyGrid />
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EstateHub</h2>
            <p className="text-muted-foreground">
              We provide an unparalleled real estate experience with attention to every detail
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-border transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Transactions</h3>
              <p className="text-muted-foreground">
                Our platform ensures your data and transactions are protected with industry-leading security measures.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-border transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Direct Communication</h3>
              <p className="text-muted-foreground">
                Connect directly with property owners or buyers without intermediaries, saving time and reducing costs.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-border transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Listings</h3>
              <p className="text-muted-foreground">
                Every property on our platform undergoes a thorough verification process to ensure authenticity and accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-accent/5">
        <div className="container px-4 mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Join thousands of satisfied customers who found their perfect place through EstateHub.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary">Get Started</button>
                  <button className="btn-outline">Learn More</button>
                </div>
              </div>
              <div className="bg-center bg-cover h-full min-h-[300px]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)' }}>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">RE</span>
                </div>
                <span className="font-medium text-lg">EstateHub</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">
                The most elegant way to discover and acquire your next property.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm">Properties</a></li>
                <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm">For Sale</a></li>
                <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm">For Rent</a></li>
                <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm">Land</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm">Our Story</a></li>
                <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm">Team</a></li>
                <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm">Careers</a></li>
                <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Stay Connected</h3>
              <p className="text-primary-foreground/70 text-sm mb-4">
                Subscribe to our newsletter for updates
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 rounded-l-md text-foreground focus:outline-none"
                />
                <button className="bg-accent text-white px-4 py-2 rounded-r-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/70 text-sm">
              © 2023 EstateHub. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 5.61c-.77.34-1.6.58-2.46.68.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.05-1.58-1.68-4.23-1.77-5.91-.2-.88.83-1.33 2.03-1.21 3.23-3.35-.17-6.49-1.76-8.62-4.35-.7 1.19-.92 2.61-.58 3.96.34 1.35 1.18 2.49 2.31 3.15-.67-.02-1.33-.2-1.91-.5v.05c0 2.32 1.64 4.33 3.94 4.79-.62.17-1.27.19-1.91.07.64 1.99 2.47 3.35 4.57 3.39-1.73 1.35-3.89 2.09-6.1 2.08-.39 0-.78-.02-1.17-.07 2.24 1.44 4.85 2.2 7.5 2.2 9 0 13.92-7.46 13.92-13.93 0-.21 0-.42-.01-.63.96-.69 1.79-1.55 2.46-2.54z"/>
                </svg>
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.64 13.07c-.25.55-.77.84-1.27.84-.17 0-.34-.03-.51-.1-1.42-.63-3.12-.93-4.97-.93-1.52 0-3 .22-4.15.63-.16.06-.33.09-.5.09-.52 0-1.03-.31-1.27-.84-.31-.65-.05-1.42.6-1.74 1.59-.67 3.42-.94 5.33-.94 2.13 0 4.17.34 5.84.96.65.32.9 1.1.6 1.74z" />
                  <ellipse cx="7.5" cy="7.5" rx="1.5" ry="1.5" />
                  <ellipse cx="16.5" cy="7.5" rx="1.5" ry="1.5" />
                </svg>
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
