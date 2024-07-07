import { FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

function Header({ theme, toggleTheme }) {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <header className={`bg-white dark:bg-darkblue ${theme === 'dark' ? 'dark' : ''} p-3 fixed top-0 left-0 w-full z-50`}>
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
          <Link to='/home'>
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
              placeholder={t('Location_or_Title')}
              className="bg-transparent p-3 rounded-lg dark:bg-slate-900 focus:outline-none w-24 sm:w-64 text-black dark:text-white border-none"
            />
            <button>
              <FaSearch className='text-slate-600' />
            </button>
          </form>

          <ul className='flex gap-4 items-center'>
            <Link to='/home'><li className='hidden sm:inline text-slate-700 hover:underline dark:text-white'>{t('home')}</li></Link>
            <Link to='/about'><li className='hidden sm:inline text-slate-700 hover:underline dark:text-white'>{t('about')}</li></Link>
            <Link to='/profile'>
              {currentUser ? (
                <img
                  className='rounded-full h-7 w-7 object-cover'
                  src={currentUser.avatar}
                  alt='profile'
                />
              ) : (
                <li className='text-slate-700 hover:underline dark:text-white'>{t('sign_in')}</li>
              )}
            </Link>
            <li>
              <button onClick={toggleTheme} className="px-2 py-2 rounded-3xl bg-slate-50 hover:bg-blue-950 hover:text-slate-50 text-slate-700 dark:bg-darkblue dark:text-white hover:dark:bg-slate-50 dark:hover:text-darkblue">
                {theme === 'light' ? <FaSun /> : <FaMoon />}
              </button>
            </li>
            <li>
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                defaultValue={i18n.language}
                className="bg-white dark:bg-darkblue text-slate-700 dark:text-white rounded-lg p-1 focus:outline-none dark:hover:bg-slate-800 "
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="kn">ಕನ್ನಡ</option>
              </select>
            </li>
          </ul>
        </div>
      </header>
    </Suspense>
  );
}

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Header;
