import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFound() {
   const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-darkblue">
      <div className="text-center">
        <h1 className="text-9xl font-bold animate-bounce text-red-500">404</h1>
        <p className="text-xl font-medium mt-4 animate-fadeIn">
       {t('oops')}
        </p>
        <Link
          to="/home"
          className="rounded-full mt-8 inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-500  hover:bg-blue-700 transition duration-300 animate-fadeInDelay"
        >
          {t('gotohome')}
          
        </Link>
        
      </div>
    </div>
  );
}

export default NotFound;
