import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }

      setMessage('Password reset successful!');
    } catch (err) {
      setError('Something went wrong, please try again later.');
    }
  };

  return (
    <div className='p-3 pt-36 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 dark:text-white uppercase'>{t('reset_password')}</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
          type='text'
          placeholder={t('otp')}
          className='border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none'
          id='otp'
          onChange={handleChange}
        />
        <input
          required
          type='password'
          placeholder={t('new_password')}
          className='border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none'
          id='newPassword'
          onChange={handleChange}
        />
        <button className='bg-slate-700 dark:bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 border-none'>
          {t('submit')}
        </button>
      </form>
      {message && (
        <div>
          <p className='text-green-500 mt-5'></p>
          <Link to='/signin' className='text-blue-700 dark:text-blue-400'>
            {t('sign_in')}
          </Link>
        </div>
      )}
      <Link to = '/signin'> 
      <p className='p-6 text-blue-400'>click here after resetting password</p>
      </Link> 
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
};

export default ResetPassword;
