import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }

      setMessage('OTP sent to your email!');
    } catch (err) {
      setError('Something went wrong, please try again later.');
    }
  };

  return (
    <div className='p-3 pt-36 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 dark:text-white uppercase'>{t('forgot_password')}</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          required
          type='email'
          placeholder={t('email')}
          className='border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none'
          id='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className='bg-slate-700 dark:bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 border-none'>
          {t('submit')}
        </button>
      </form>
      {message && (
        <div>
             <p className='text-green-500 mt-5'>{message}</p>
        </div>
      )}
      <Link to = '/reset-password'> 
      <p className='p-6 text-blue-400'>click here after getting the otp</p>
      </Link> 
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
