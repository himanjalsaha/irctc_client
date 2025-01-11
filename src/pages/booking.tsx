import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Train, Calendar, Clock, Users } from 'lucide-react';
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
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/bookings/user/${user?.id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        setBookings(response.data.bookings);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) {
      fetchBookings();
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
        <div className="text-red-500 bg-red-50 p-4 rounded-lg inline-block">
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-blue-500 hover:text-blue-600"
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
                <span>
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