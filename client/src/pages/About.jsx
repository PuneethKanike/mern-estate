import { useTranslation } from 'react-i18next';
import { FaInstagram, FaWhatsapp, FaLinkedinIn, FaGithubAlt } from 'react-icons/fa';
import image1 from '../images/image1.png';
import image2 from '../images/image2.png';
import image3 from '../images/image3.png';
import image4 from '../images/image4.png';
import image5 from '../images/image5.png';
import image6 from '../images/image6.png';
import '../css/CardZoom.css';

function About() {
  const { t } = useTranslation();

  return (
    <div className='py-28 px-4 max-w-6xl mx-auto z-0'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800 dark:text-blue-300'>{t('about_title')}</h1>
      <p className='mb-4 text-slate-700 dark:text-white'>{t('about_desc1')}</p>
      <p className='mb-4 text-slate-700 dark:text-white'>{t('about_desc2')}</p>
      <p className='mb-4 text-slate-700 dark:text-white'>{t('about_desc3')}</p>
      <p className='mb-4 text-slate-700 dark:text-white'>{t('about_desc4')}</p>

      <h2 className='text-2xl font-bold mt-12 mb-6 text-slate-800 dark:text-blue-300'>{t('manual_title')}</h2>
      <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        <div className='card flex flex-col items-center dark:bg-slate-900 p-3 rounded-2xl bg-white'>
          <img src={image1} alt='Home Page' className='w-full h-auto mb-4 rounded-lg shadow-md' />
          <p className='text-slate-700 dark:text-white'>{t('home_page_desc')}</p>
        </div>
        <div className='card flex flex-col items-center dark:bg-slate-900 p-3 rounded-2xl bg-white'>
          <img src={image2} alt='Search Page' className='w-full h-auto mb-4 rounded-lg shadow-md' />
          <p className='text-slate-700 dark:text-white'>{t('search_page_desc')}</p>
        </div>
        <div className='card flex flex-col items-center dark:bg-slate-900 p-3 rounded-2xl bg-white'>
          <img src={image3} alt='Sign Up Page' className='w-full h-auto mb-4 rounded-lg shadow-md' />
          <p className='text-slate-700 dark:text-white'>{t('sign_up_page_desc')}</p>
        </div>
        <div className='card flex flex-col items-center dark:bg-slate-900 p-3 rounded-2xl bg-white'>
          <img src={image4} alt='Property Listing Page' className='w-full h-auto mb-4 rounded-lg shadow-md' />
          <p className='text-slate-700 dark:text-white'>{t('property_listing_page_desc')}</p>
        </div>
        <div className='card flex flex-col items-center dark:bg-slate-900 p-3 rounded-2xl bg-white'>
          <img src={image5} alt='Profile Page' className='w-full h-auto mb-4 rounded-lg shadow-md' />
          <p className='text-slate-700 dark:text-white'>{t('profile_page_desc')}</p>
        </div>
        <div className='card flex flex-col items-center dark:bg-slate-900 p-3 rounded-2xl bg-white'>
          <img src={image6} alt='Messaging System' className='w-full h-auto mb-4 rounded-lg shadow-md' />
          <p className='text-slate-700 dark:text-white'>{t('messaging_system_desc')}</p>
        </div>
      </div>

      <h2 className='text-2xl font-bold mt-12 mb-6 text-slate-800 dark:text-blue-300 text-center'>{t('contact_title')}</h2>
      <div className='flex flex-col items-center text-center'>
        <p className='mb-4 text-slate-700 dark:text-white'><strong>{t('name')}:</strong> Puneeth K</p>
        <p className='mb-4 text-slate-700 dark:text-white'><strong>{t('profession')}:</strong> Web Developer</p>
        <p className='mb-4 text-slate-700 dark:text-white'><strong>{t('phone')}:</strong> +917975187240</p>
        <p className='mb-4 text-slate-700 dark:text-white'><strong>{t('email')}:</strong> kanike.puneeth@gmail.com</p>
        <div className='flex space-x-4 mt-4'>
          <a href='https://instagram.com/k_puneeth_gowda' className='rounded text-slate-700 dark:text-white hover:bg-slate-700 hover:text-white dark:hover:bg-white dark:hover:text-black' target='_blank' rel='noopener noreferrer'><FaInstagram className='text-2xl' /></a>
          <a href='https://github.com/PuneethKanike' className='rounded text-slate-700 dark:text-white hover:bg-slate-700 hover:text-white dark:hover:bg-white dark:hover:text-black' target='_blank' rel='noopener noreferrer'><FaGithubAlt className='text-2xl' /></a>
          <a href='https://wa.me/7975187240' className='rounded text-slate-700 dark:text-white hover:bg-slate-700 hover:text-white dark:hover:bg-white dark:hover:text-black' target='_blank' rel='noopener noreferrer'><FaWhatsapp className='text-2xl' /></a>
          <a href='https://linkedin.com/in/puneeth-kanike' className='rounded text-slate-700 dark:text-white hover:bg-slate-700 hover:text-white dark:hover:bg-white dark:hover:text-black' target='_blank' rel='noopener noreferrer'><FaLinkedinIn className='text-2xl' /></a>
        </div>
      </div>
    </div>
  );
}

export default About;
