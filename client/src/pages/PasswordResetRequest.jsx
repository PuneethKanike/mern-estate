import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function PasswordResetRequest() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let errorTimer;
    let messageTimer;
    let resendTimer;

    if (error) {
      errorTimer = setTimeout(() => {
        setError('');
      }, 4000);
    }

    if (message) {
      messageTimer = setTimeout(() => {
        setMessage('');
      }, 4000);
    }

    if (resendDisabled) {
      resendTimer = setTimeout(() => {
        setResendDisabled(false);
      }, 5000);
    }

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(messageTimer);
      clearTimeout(resendTimer);
    };
  }, [error, message, resendDisabled]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setMessage(data.message);
      setError('');
      setOtpSent(true);
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 429) {
        setError(t('too_many_requests'));
      } else {
        setError(error.message);
      }
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setMessage(data.message);
      setError('');
    } catch (error) {
      setIsLoading(false);
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
          value={email}
          onChange={handleChange}
        />
        {!otpSent && (
          <button
            type='submit'
            className='bg-slate-700 dark:bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 border-none'
            disabled={isLoading}
          >
            {isLoading ? t('loading') : t('send_otp')}
          </button>
        )}
      </form>
      {otpSent && (
        <div className='mt-4'>
          <button
            className='bg-slate-700 dark:bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-50 border-none'
            onClick={handleResend}
            disabled={resendDisabled || isLoading}
          >
            {isLoading ? t('loading') : t('resend_otp')}
          </button>
        </div>
      )}
      {message && <p className='text-green-500 mt-5'>{message}</p>}
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      <div className='mt-5'>
        <Link to='/reset-password' className='text-blue-700 dark:text-blue-400'>
          {t('go_to_reset_password')}
        </Link>
      </div>
    </div>
  );
}
