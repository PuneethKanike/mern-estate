import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WelcomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate('/home'); 
    }, 3000);

    return () => clearTimeout(timeoutId); 
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1 className='text-slate-700 dark:text-slate-400 font-bold text-3xl lg:text-6xl'>
        {t('welcome_message')} <span className='text-slate-500 dark:text-slate-100'>{t('live_link_name_1')}</span><span className='text-slate-700 dark:text-slate-600'>{t('live_link_name_2')}</span>
      </h1>
      <br />
      <p>{t('redirecting_message')}</p>
    </div>
  );
};

export default WelcomePage
