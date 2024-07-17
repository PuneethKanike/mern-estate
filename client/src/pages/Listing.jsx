import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import Contact from '../components/Contact';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt, 
  FaParking,
  FaShare,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

export default function Listing() {
  SwiperCore.use([Navigation]);
  const { t } = useTranslation(); // Initialize useTranslation hook
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='p-10'>
      {loading && <p className='text-center my-7 text-2xl'>{t('Loading...')}</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>{t('Something_went_wrong!')}</p>
      )}
      {listing && !loading && !error && (
        <div className='pt-12'>
          <Swiper navigation loop>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10  border-darkblue rounded-full w-12 h-12 flex justify-center items-center bg-white dark:bg-darkblue cursor-pointer'>
            <FaShare
              className='text-black dark:text-white'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100  p-2 dark:bg-darkblue'>
              {t('Link_copied!')}
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - <span className='text-green-800 dark:text-green-400'>₹{' '}
               {listing.offer
    ? listing.discountPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace(/₹\s?/, '')
    : listing.regularPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace(/₹\s?/, '')}
  {listing.type === 'rent' && ` / ${t('month')}`}
              </span>
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600 dark:text-white text-sm'>
              <FaMapMarkerAlt className='text-green-700 dark:text-green-500' />
              {listing.address}
            </p>
             <a className='text-blue-400' target="_blank" href={listing.link}>{t('Google_Map_location')}</a>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? t('For_rent') : t('For_sale')}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ₹{+listing.regularPrice - +listing.discountPrice} {t('Saved')}
                </p>
                
              )}
              <p className={`w-full max-w-[200px] text-center p-1 rounded-md ${listing.available ? '' : 'bg-red-900 text-white'}`}>
              {listing.available ? '' : t('Currently_not_available')}
            </p>
            </div>
            <p className='text-slate-800 dark:text-white'>
              <span className='font-semibold text-black dark:text-slate-400'>{t('Description')} - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 dark:text-green-500 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} ${t('beds')} `
                  : `${listing.bedrooms} ${t('bed')} `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} ${t('baths')} `
                  : `${listing.bathrooms} ${t('bath')} `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? t('Parking_spot') : t('No_Parking')}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? t('Furnished') : t('Unfurnished')}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                {t('Contact_landlord')}
              </button>
            )}
            {contact && <Contact listing={listing}/>}
          </div>
        </div>
      )}
    </main>
  );
}
