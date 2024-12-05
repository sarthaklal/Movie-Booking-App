import React, { useState } from 'react';
import { MapPin, Search, Film, Star, ArrowLeft, Check } from 'lucide-react';

// Mock data
const THEATERS = [
  {
    id: 1,
    name: 'Cineplex Royal',
    location: 'Mumbai, Maharashtra',
    distance: '2.3 km',
    movies: [
      { 
        id: 101, 
        title: 'Epic Adventure', 
        poster: '/api/placeholder/200/300', 
        showtimes: ['10:00 AM', '1:30 PM', '4:45 PM', '8:00 PM'] 
      },
      { 
        id: 102, 
        title: 'Sci-Fi Odyssey', 
        poster: '/api/placeholder/200/300', 
        showtimes: ['11:15 AM', '2:45 PM', '6:00 PM', '9:30 PM'] 
      }
    ]
  },
  {
    id: 2,
    name: 'Starlight Cinema',
    location: 'Delhi, National Capital Territory',
    distance: '4.7 km',
    movies: [
      { 
        id: 103, 
        title: 'Romantic Comedy', 
        poster: '/api/placeholder/200/300', 
        showtimes: ['12:00 PM', '3:15 PM', '5:45 PM', '8:30 PM'] 
      }
    ]
  }
];

// Generate seat map
const generateSeatMap = () => {
  const rows = 'ABCDEFG';
  const seatMap = [];

  rows.split('').forEach(row => {
    for (let i = 1; i <= 10; i++) {
      seatMap.push({
        id: `${row}${i}`,
        row: row,
        number: i,
        status: Math.random() < 0.2 ? 'sold' : 'available'
      });
    }
  });

  return seatMap;
};

const MovieBookingComponent = () => {
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const seatMap = generateSeatMap();

  // Filter theaters based on search query
  const filteredTheaters = THEATERS.filter(theater => 
    theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theater.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSeatSelection = (seat) => {
    if (seat.status === 'sold') return;

    setSelectedSeats(prevSeats => 
      prevSeats.includes(seat.id) 
        ? prevSeats.filter(id => id !== seat.id)
        : [...prevSeats, seat.id]
    );
  };

  const renderSeatSelection = () => {
    const rows = 'ABCDEFG'.split('');
    return (
      <div>
        <button 
          onClick={() => setSelectedShowtime(null)} 
          className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center"
        >
          <ArrowLeft className="mr-2" /> Back to Showtimes
        </button>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Select Your Seats</h2>
          
          {/* Screen Indicator */}
          <div className="w-full bg-gray-700 h-2 rounded-t-lg mb-6"></div>

          {/* Seat Layout */}
          <div className="grid grid-cols-10 gap-2">
            {rows.map(row => (
              seatMap.filter(seat => seat.row === row).map(seat => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatSelection(seat)}
                  className={`
                    w-8 h-8 rounded-sm 
                    ${seat.status === 'sold' ? 'bg-red-600 cursor-not-allowed' : 
                      selectedSeats.includes(seat.id) ? 'bg-green-600' : 'bg-gray-700'}
                    text-white text-xs flex items-center justify-center
                    hover:opacity-80 transition-colors
                  `}
                  disabled={seat.status === 'sold'}
                >
                  {seat.id}
                  {selectedSeats.includes(seat.id) && <Check size={12} />}
                </button>
              ))
            ))}
          </div>

          {/* Seat Legend */}
          <div className="flex justify-center space-x-4 mt-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-700 mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-600 mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 mr-2"></div>
              <span>Sold</span>
            </div>
          </div>

          {/* Proceed Button */}
          {selectedSeats.length > 0 && (
            <div className="mt-6 text-center">
              <button 
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => {/* Proceed to next step */}}
              >
                Proceed to Food & Beverages ({selectedSeats.length} seats)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMovieShowtimes = () => {
    return (
      <div>
        <button 
          onClick={() => setSelectedMovie(null)} 
          className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center"
        >
          <ArrowLeft className="mr-2" /> Back to Movies
        </button>
        <h2 className="text-2xl font-semibold mb-6">Select Showtime for {selectedMovie.title}</h2>
        <div className="grid gap-4">
          {selectedMovie.showtimes.map(time => (
            <button
              key={time}
              onClick={() => setSelectedShowtime(time)}
              className="bg-gray-900 hover:bg-gray-800 p-4 rounded-lg flex justify-between items-center transition-colors"
            >
              <span className="text-xl">{time}</span>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">Select Seats</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen p-6 font-sans">
      {/* Header and Search */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Book Your Movie</h1>
        
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search theaters or locations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Theater Selection */}
      {!selectedTheater && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Select a Theater</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTheaters.map(theater => (
              <div 
                key={theater.id} 
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => setSelectedTheater(theater)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{theater.name}</h3>
                  <MapPin className="text-red-600" />
                </div>
                <p className="text-gray-400 mb-2">{theater.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{theater.distance}</span>
                  <span className="text-sm text-green-500">{theater.movies.length} Movies Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movie Selection */}
      {selectedTheater && !selectedMovie && (
        <div>
          <button 
            onClick={() => setSelectedTheater(null)} 
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center"
          >
            <ArrowLeft className="mr-2" /> Back to Theaters
          </button>
          <h2 className="text-2xl font-semibold mb-6">Select a Movie at {selectedTheater.name}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedTheater.movies.map(movie => (
              <div 
                key={movie.id} 
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => setSelectedMovie(movie)}
              >
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{movie.title}</h3>
                  <Star className="text-yellow-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Showtime Selection */}
      {selectedMovie && !selectedShowtime && renderMovieShowtimes()}

      {/* Seat Selection */}
      {selectedShowtime && renderSeatSelection()}
    </div>
  );
};

export default MovieBookingComponent;
