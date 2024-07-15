import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import Oauth from '../components/Oauth';
import { useTranslation } from 'react-i18next';

export default function SignIn() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/home');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='p-3 pt-36 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 dark:text-white uppercase'>{t('sign_in')}</h1>
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
          type='password'
          placeholder={t('password')}
          className='border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none'
          id='password'
          required
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 dark:bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 border-none'
        >
          {loading ? t('loading') : t('sign_in')}
        </button>
        <Oauth />
      </form>
      <div className='flex gap-2 mt-5 justify-between'>
        <Link to={'/request-password-reset'}>
          <span className='text-blue-700 dark:text-blue-400'>{t('forgot_password')}</span>
        </Link>
        <div className='flex gap-2'>
          <p className='dark:text-white'>{t('no_account')}</p>
          <Link to={'/signup'}>
            <span className='text-blue-700 dark:text-blue-400'>{t('sign_up')}</span>
          </Link>
        </div>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
