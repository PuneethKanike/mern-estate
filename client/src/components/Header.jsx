import { useState, useEffect } from 'react';
import { FaSearch, FaSun, FaMoon, FaBars } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function Header({ theme, toggleTheme }) {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <header className={`bg-white dark:bg-darkblue ${theme === 'dark' ? 'dark' : ''} pt-2 pb-2 fixed top-0 left-0 w-full z-50`}>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div className="flex items-center flex-shrink-0">
          <Link to='/home'>
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap text-slate-700 dark:text-white">
              <span className="text-slate-500 dark:text-slate-50">Live</span>
              <span className="text-slate-700 dark:text-slate-500">Link</span>
            </h1>
          </Link>
        </div>

        <div className="flex-grow mx-4">
          <form onSubmit={handleSubmit} className="flex items-center justify-center">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder={t('Location_or_Title')}
              className="bg-transparent rounded-lg focus:outline-none text-black dark:text-white border-none w-full max-w-md"
            />
            <button type="submit" className="flex items-center justify-center p-3 text-slate-600">
              <FaSearch />
            </button>
          </form>
        </div>

        <ul className='flex items-center gap-1 sm:gap-4 flex-shrink-0'>
          <Link to='/home'><li className='text-slate-700 hover:underline dark:text-white hidden sm:inline'>{t('home')}</li></Link>
          <Link to='/about'><li className='text-slate-700 hover:underline dark:text-white hidden sm:inline'>{t('about')}</li></Link>
          <Link to='/chat'><li className='text-slate-700 hover:underline dark:text-white hidden sm:inline'>{t('chat')}</li></Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover hidden sm:inline'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-slate-700 hover:underline dark:text-white hidden sm:inline'>{t('sign_in')}</li>
            )}
          </Link>
          <li className="hidden sm:inline">
            <button onClick={toggleTheme} className="px-2 py-2 rounded-3xl bg-slate-50 hover:bg-blue-950 hover:text-slate-50 text-slate-700 dark:bg-darkblue dark:text-white hover:dark:bg-slate-50 dark:hover:text-darkblue">
              {theme === 'light' ? <FaSun /> : <FaMoon />}
            </button>
          </li>
          <li className="hidden sm:inline">
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={i18n.language}
              className="bg-white dark:bg-darkblue text-slate-700 dark:text-white rounded-lg p-1 focus:outline-none dark:hover:bg-slate-800"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </li>
        </ul>

        {/* Mobile Drawer Toggle */}
        <button onClick={toggleDrawer} className="sm:hidden">
          <FaBars className="text-slate-700 dark:text-slate-400 text-xl" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="p-3 sm:hidden bg-white dark:bg-darkblue shadow-md fixed top-0 left-0 w-64 h-full z-50">
          <nav className="p-4">
            <ul>
              <li className="mb-4">
                <Link to='/profile' onClick={toggleDrawer} className="flex items-center text-slate-700 hover:underline dark:text-white">
                  {currentUser ? (
                    <img
                      className="rounded-full h-7 w-7 object-cover mr-2"
                      src={currentUser.avatar}
                      alt="profile"
                    />
                  ) : (
                    <span>{t('sign_in')}</span>
                  )}
                </Link>
              </li>
              <li className="mb-4">
                <Link to='/home' onClick={toggleDrawer} className="text-slate-700 hover:underline dark:text-white">
                  {t('home')}
                </Link>
              </li>
              <li className="mb-4">
                <Link to='/about' onClick={toggleDrawer} className="text-slate-700 hover:underline dark:text-white">
                  {t('about')}
                </Link>
              </li>
              <li className="mb-4">
                <Link to='/chat' onClick={toggleDrawer} className="text-slate-700 hover:underline dark:text-white">
                  {t('chat')}
                </Link>
              </li>
              <li className="mb-4">
                <button onClick={toggleTheme} className="flex items-center text-slate-700 hover:underline dark:text-white">
                  {theme === 'light' ? (
                    <>
                      <FaMoon className="mr-2" />
                    </>
                  ) : (
                    <>
                      <FaSun className="mr-2" />
                    </>
                  )}
                </button>
              </li>
              <li>
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  defaultValue={i18n.language}
                  className="bg-white dark:bg-darkblue text-slate-700 dark:text-white rounded-lg pl-0 pt-1 pr-1 pb-1 focus:outline-none dark:hover:bg-slate-800"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="kn">ಕನ್ನಡ</option>
                </select>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Header;
