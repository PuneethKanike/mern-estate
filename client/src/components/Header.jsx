import { FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

function Header({ theme, toggleTheme }) {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className={`bg-white dark:bg-darkblue ${theme === 'dark' ? 'dark' : ''} fixed top-0 left-0 w-full z-50`}>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap text-slate-700 dark:text-white">
            <span className="text-slate-500 dark:text-slate-50">Live</span>
            <span className="text-slate-700 dark:text-slate-500">Link</span>
          </h1>
        </Link>

        <form className="dark:bg-slate-900 rounded-lg flex items-center pr-3">
          <input
            type="text"
            placeholder="Location or Title . . ."
            className="bg-transparent p-3 rounded-lg dark:bg-slate-900 focus:outline-none w-24 sm:w-64 text-black dark:text-white border-none"
          />
          <FaSearch className='text-slate-500 dark:text-white' />
        </form>

        <ul className='flex gap-4'>
          <Link to='/'><li className=' text-slate-700 hover:underline dark:text-white'>Home</li></Link>
          <Link to='/about'><li className=' text-slate-700 hover:underline dark:text-white'>About</li></Link>
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
