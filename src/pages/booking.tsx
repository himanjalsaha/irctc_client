import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Train, Calendar, Clock, Users } from 'lucide-react';
import { useAuth } from '../context/authcontext';

interface Booking {
  booking_id: string;
  train_id: string;
  train_name: string;
  number_of_seats: number;
  seat_numbers: number[];
  arrival_time_at_source: string;
  arrival_time_at_destination: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token  , user} = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/bookings/user/${user?.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data.bookings);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) return <div className="text-center py-10">Loading bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.booking_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Train className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">{booking.train_name}</h2>
            </div>
            <div className="space-y-2">
              <p className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Booking ID: {booking.booking_id.slice(0, 8)}...</span>
              </p>
              <p className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>Departure: {booking.arrival_time_at_source}</span>
              </p>
              <p className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>Arrival: {booking.arrival_time_at_destination}</span>
              </p>
              <p className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>Seats: {booking.number_of_seats} ({booking.seat_numbers.join(', ')})</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;

