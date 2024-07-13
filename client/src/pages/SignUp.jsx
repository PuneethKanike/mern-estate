import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Oauth from '../components/Oauth';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({});
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      setOtpSent(true);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/signin');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  if (otpSent) {
    return (
      <div className='p-3 pt-36 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7 dark:text-white uppercase'>{t('Enter OTP')}</h1>
        <form onSubmit={handleOtpSubmit} className='flex flex-col gap-4'>
          <input
            required
            type='text'
            placeholder={t('otp')}
            className='border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none'
            id='otp'
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            disabled={loading}
            className='bg-slate-700 dark:bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? t('loading') : t('Submit OTP')}
          </button>
        </form>
        {error && <p className='text-red-500 dark:text-red-400 mt-5'>{error}</p>}
      </div>
    );
  }

  return (
    <div className='p-3 pt-36 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 dark:text-white uppercase'>{t('sign_up')}</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          required
          type='text'
          placeholder={t('username')}
          className='border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none'
          id='username'
          onChange={handleChange}
        />
        <input
          required
          type='email'
          placeholder={t('email')}
          className='border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none'
          id='email'
          onChange={handleChange}
        />
        <input
          required
          type='password'
          placeholder={t('password')}
          className='border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none'
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 dark:bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? t('loading') : t('sign_up')}
        </button>
        <Oauth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p className='dark:text-white'>{t('have_account')}</p>
        <Link to={'/signin'}>
          <span className='text-blue-700 dark:text-blue-400'>{t('sign_in')}</span>
        </Link>
      </div>
      {error && <p className='text-red-500 dark:text-red-400 mt-5'>{error}</p>}
    </div>
  );
}
