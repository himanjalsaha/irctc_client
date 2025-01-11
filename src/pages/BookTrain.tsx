import React, { useState } from "react";
import { useAuth } from "../context/authcontext";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

const BookTrain: React.FC = () => {
  const { user, token } = useAuth();
  const [numSeats, setNumSeats] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { train_id } = useParams<{ train_id: string }>();
  const navigate = useNavigate();

  const handleSeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) setNumSeats(value);
  };

  const handleBooking = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `https://irctc-backend-ns9u.onrender.com/api/train/${train_id}/book`,
        {
          no_of_seats: numSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Booking successful:", res.data);
      setIsSuccess(true);
      // Optionally handle redirection or other actions after booking
      setTimeout(() => {
        navigate('/'); // Redirect to home page after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Error during booking:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred during booking. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold mb-4">Train Booking</h2>
          <p className="text-gray-600 mb-4">Train ID: {train_id}</p>
          <h3 className="text-lg font-semibold mb-4">Enter Number of Seats</h3>
          
          <label className="block text-gray-700 mb-2">
            Number of Seats:
            <input
              type="number"
              value={numSeats}
              onChange={handleSeatChange}
              className="border border-gray-300 rounded w-full px-3 py-2 mt-1"
              min="1"
              disabled={isLoading || isSuccess}
            />
          </label>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded relative" role="alert">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Booking successful! Redirecting to home page...</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => navigate(-1)} // Go back to the previous page
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              disabled={isLoading || isSuccess}
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center ${
                (isLoading || isSuccess) && 'opacity-50 cursor-not-allowed'
              }`}
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTrain;

