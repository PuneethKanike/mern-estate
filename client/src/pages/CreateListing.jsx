import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CreateListing() {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    available: true,
    link: '', // Added link field
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, type, value } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData({
        ...formData,
        type: id,
      });
    } else if (id === 'parking' || id === 'furnished' || id === 'offer' || id === 'available') {
      setFormData({
        ...formData,
        [id]: e.target.checked,
      });
    } else if (type === 'number' || type === 'text' || type === 'textarea') {
      setFormData({
        ...formData,
        [id]: value,
      });
    } else if (id === 'link') {
      setFormData({
        ...formData,
        link: value,
      });
    }
  };

  const isValidGoogleMapsLink = (link) => {
    const pattern = /^https:\/\/maps\.app\.goo\.gl\/[\w-]+$/;
    return pattern.test(link);
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError(t('You_must_upload_at_least_one_image'));
      if (+formData.regularPrice < +formData.discountPrice)
        return setError(t('Discount_price_must_be_lower_than_regular_price'));
      if (!isValidGoogleMapsLink(formData.link)) {
        setError(t('Please_enter_a_valid_Google_Maps_link'));
        return;
      }
      setLoading(true);
      setError(false); // Clear any previous error
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`); // Corrected string interpolation
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 pt-32 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        {t('Create_a_Listing')}
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder={t('Name')}
            className='p-3 rounded-lg dark:bg-slate-900 focus:outline-none bg-slate-200'
            id='name'
            
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder={t('Description')}
            className='p-3 rounded-lg dark:bg-slate-900 focus:outline-none bg-slate-200'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <textarea
            type='text'
            
            placeholder={t('Address')}
            className='p-3 rounded-lg dark:bg-slate-900 focus:outline-none bg-slate-200'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          
          <input
            type='text'
            placeholder={t('Link')}
            className='p-3 rounded-lg dark:bg-slate-900 focus:outline-none bg-slate-200'
            id='link'
            required
            onChange={handleChange}
            value={formData.link}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>{t('Sell')}</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>{t('Rent')}</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>{t('Parking_spot')}</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>{t('Furnished')}</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>{t('Offer')}</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='available'
                className='w-5'
                onChange={handleChange}
                checked={formData.available}
              />
              <span>{t('Available')}</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border-gray-300 rounded-lg dark:bg-slate-900 focus:outline-none bg-slate-200'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>{t('Beds')}</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border-gray-300 rounded-lg dark:bg-slate-900 focus:outline-none bg-slate-200'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>{t('Baths')}</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 rounded-lg dark:bg-slate-900 focus:outline-none bg-slate-200'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>{t('Regular_price')}</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>(₹ / {t('month')})</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 rounded-lg dark:bg-slate-900 focus:outline-none bg-slate-200'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>{t('Discounted_price')}</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>(₹ / {t('month')})</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            {t('Images')}:
            <span className='font-normal text-gray-600 ml-2'>
               {t('The_first_image_will_be_the_cover')} (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? t('Uploading') : t('Upload')}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center dark:bg-slate-900 rounded-2xl'
              >
                <img
                  src={url}
                  alt={t('Listing_image')}
                  className='w-20 h-30 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  {t('Delete')}
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? t('Creating') : t('Create_listing')}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
