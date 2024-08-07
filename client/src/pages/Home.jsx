import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const { t } = useTranslation();
  SwiperCore.use([Navigation, Autoplay]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <motion.h1 
          className='text-slate-700 dark:text-slate-400 font-bold text-3xl lg:text-6xl'
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
        >
          {t('find_next')} <span className='text-slate-500 dark:text-slate-600'>{t('perfect')}</span>
          <br />
          {t('place_with_ease')}
        </motion.h1>
        <motion.div 
          className='text-gray-400 text-xs sm:text-sm'
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0, delay: 1 }}
        >
          {t('live_link_desc')}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0, delay: 1 }}
        >
          <Link
            to={'/search'}
            className='text-xs sm:text-sm text-blue-800 dark:text-blue-500 font-bold hover:underline'
          >
            {t('get_started')}
          </Link>
        </motion.div>
      </div>

      {/* swiper */}
      <Swiper
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing, index) => (
            <SwiperSlide key={listing._id}>
              <motion.div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 5, delay: index * 0.5 }}
              ></motion.div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale, and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600 dark:text-slate-400'>{t('recent_offers')}</h2>
              <Link className='text-sm text-blue-800 dark:text-blue-400 hover:underline' to={'/search?offer=true'}>
                {t('show_more_offers')}
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing, index) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ListingItem listing={listing} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600 dark:text-slate-400'>{t('recent_places_for_rent')}</h2>
              <Link className='text-sm text-blue-800 dark:text-blue-400 hover:underline' to={'/search?type=rent'}>
                {t('show_more_places_for_rent')}
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing, index) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ListingItem listing={listing} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600 dark:text-slate-400'>{t('recent_places_for_sale')}</h2>
              <Link className='text-sm text-blue-800 hover:underline dark:text-blue-400' to={'/search?type=sale'}>
                {t('show_more_places_for_sale')}
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing, index) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ListingItem listing={listing} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
