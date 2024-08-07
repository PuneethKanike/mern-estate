import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function ListingItem({ listing }) {
  const { t } = useTranslation();

  return (
    <div className={`bg-white dark:bg-slate-900 shadow-md hover:shadow-lg dark:hover:shadow-sm transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] ${listing.available ? '' : 'opacity-50'}`}>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700 dark:text-slate-300'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full dark:text-slate-300'>
              {listing.address}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2 dark:text-slate-300'>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold dark:text-green-300'>
            ₹
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).replace(/₹\s?/, '')
              : listing.regularPrice.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).replace(/₹\s?/, '')}
            {listing.type === 'rent' && ` / ${t('month')}`}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs dark:text-slate-300'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} ${t('beds')} `
                : `${listing.bedrooms} ${t('bed')} `}
            </div>
            <div className='font-bold text-xs dark:text-slate-300'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} ${t('baths')} `
                : `${listing.bathrooms} ${t('bath')} `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    offer: PropTypes.bool,
    discountPrice: PropTypes.number,
    regularPrice: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    available: PropTypes.bool.isRequired, 
  }).isRequired,
};
