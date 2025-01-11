import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import { BookOpen, User, LogOut, Train, Menu, X, ChevronDown } from 'lucide-react';

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleBookingsClick = () => {
    navigate(`/bookings/users/${user?.id || '123'}`);
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 text-xl font-bold hover:text-indigo-200 transition-all duration-300 transform hover:scale-105">
            <Train className="h-8 w-8" />
            <span className="hidden sm:inline">TrainBooker</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={handleBookingsClick}
              className="flex items-center space-x-2 hover:text-indigo-200 transition-all duration-300 transform hover:scale-105"
            >
              <BookOpen className="h-5 w-5" />
              <span>Bookings</span>
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-indigo-600 rounded-full px-4 py-2 hover:bg-indigo-500 transition-all duration-300"
                >
                  <User className="h-5 w-5 text-indigo-200" />
                  <span>{user.username}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button 
                      onClick={handleSignOut}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white w-full text-left transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <button 
              onClick={handleBookingsClick}
              className="block py-2 px-4 text-sm hover:bg-indigo-600 rounded transition-colors duration-200 w-full text-left"
            >
              Bookings
            </button>
            {user ? (
              <>
                <div className="py-2 px-4 text-sm">{user.username}</div>
                <button 
                  onClick={handleSignOut}
                  className="block py-2 px-4 text-sm hover:bg-indigo-600 rounded transition-colors duration-200 w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block py-2 px-4 text-sm hover:bg-indigo-600 rounded transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

