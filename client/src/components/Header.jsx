import { FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function Header({ theme, toggleTheme }) {
  
  const { currentUser } = useSelector((state) => state.user);
   const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className={`bg-white dark:bg-darkblue ${theme === 'dark' ? 'dark' : ''} p-3 fixed top-0 left-0 w-full z-50`}>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap text-slate-700 dark:text-white">
            <span className="text-slate-500 dark:text-slate-50">Live</span>
            <span className="text-slate-700 dark:text-slate-500">Link</span>
          </h1>
        </Link>

        <form onSubmit={handleSubmit} 
        className="dark:bg-slate-900 rounded-lg flex items-center pr-3">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Location or Title . . ."
            className="bg-transparent p-3 rounded-lg dark:bg-slate-900 focus:outline-none w-24 sm:w-64 text-black dark:text-white border-none"
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
         
        </form>

        <ul className='flex gap-4'>
          <Link to='/'><li className='hidden sm:inline text-slate-700 hover:underline dark:text-white'>Home</li></Link>
          <Link to='/about'><li className='hidden sm:inline text-slate-700 hover:underline dark:text-white'>About</li></Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-slate-700 hover:underline dark:text-white'>Sign in</li>
            )}
          </Link>
          <li>
            <button onClick={toggleTheme} className="px-2 py-2 rounded-3xl bg-slate-50 hover:bg-blue-950 hover:text-slate-50 text-slate-700 dark:bg-darkblue dark:text-white hover:dark:bg-slate-50 dark:hover:text-darkblue">
              {theme === 'light' ? <FaSun /> : <FaMoon />}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Header;
