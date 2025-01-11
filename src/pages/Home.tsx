import React, { useEffect, useState } from "react";
import { ArrowRightLeft, Train, Users } from "lucide-react";
import axios from "axios";
import BookTrain from "./BookTrain";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

const Home = () => {
  const [source, setSource] = useState("Station A");
  const [destination, setDestination] = useState("Station B");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);


  const handleSwapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.get(
        `https://irctc-backend-ns9u.onrender.com/api/trains/availability?source=${source}&destination=${destination}`
      );

      setTrains(res.data.response);
      setSearched(true);

    } catch (error) {
      console.error("Error fetching trains:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
       
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Search Form */}
        <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter source station"
              />
            </div>
            <button
              type="button"
              onClick={handleSwapStations}
              className="self-end md:self-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ArrowRightLeft className="h-6 w-6" />
            </button>
            <div className="flex-1">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter destination station"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
          >
            Search Trains
          </button>
        </form>
      </div>
    </div>


        {searched && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 px-4">
              {trains.length > 0 ? `Available Trains (${trains.length})` : "No trains found"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
              {trains.map((train: any) => (
                <div
                  key={train.train_id}
                  className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-200 "
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Train className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">{train.train_name}</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2" />
                      <span>Capacity: {train.seat_capacity} seats</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/booking/${train.train_id}`) }
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
    </>
  );
};


export default Home;
