import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setMessage(data.message);
       setTimeout(() => {
        navigate('/signin');
      }, 3000); //
    } catch (error) {
      setError(error.message);
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
          {t('reset_password')}
        </button>
      </form>
      {message && <p className='text-green-500 mt-5'>{message}</p>}
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
