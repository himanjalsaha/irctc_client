import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Train, Calendar, Clock, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/authcontext';

interface Booking {
  booking_id: string;
  train_id: string;
  train_name: string;
  number_of_seats: number;
  seat_numbers: number[] | number | string | null;
  arrival_time_at_source: string;
  arrival_time_at_destination: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://irctc-backend-ns9u.onrender.com/api/bookings/user/${user?.id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        
        if (response.data.error) {
          setError(response.data.error);
        } else if (response.data.bookings) {
          setBookings(response.data.bookings);
        } else {
          setError('Unexpected response format from server');
        }
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(err.response.data.error || 'An error occurred while fetching bookings');
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response received from server. Please try again later.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) {
      fetchBookings();
    } else {
      setError('User information is missing. Please log in again.');
      setLoading(false);
    }
  }, [token, user?.id]);

  const formatSeatNumbers = (seatNumbers: Booking['seat_numbers']): string => {
    if (!seatNumbers) return 'N/A';
    if (Array.isArray(seatNumbers)) return seatNumbers.join(', ');
    if (typeof seatNumbers === 'number') return seatNumbers.toString();
    return String(seatNumbers);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-50 p-4 rounded-lg inline-block max-w-md">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium mb-2">Error</p>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="bg-gray-50 p-6 rounded-lg inline-block">
          <Train className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No bookings found</p>
          <p className="text-gray-500 text-sm mt-2">Your booking history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <Train className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">{booking.train_name}</h2>
            </div>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="truncate">ID: {booking.booking_id.slice(0, 8)}...</span>
              </p>
              <p className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="truncate">Departure: {booking.arrival_time_at_source}</span>
              </p>
              <p className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="truncate">Arrival: {booking.arrival_time_at_destination}</span>
              </p>
              <p className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="truncate inline-block max-w-[180px]">
                  Seats: {booking.number_of_seats} ({formatSeatNumbers(booking.seat_numbers)})
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;