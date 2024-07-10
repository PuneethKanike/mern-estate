import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../components/CustomAlert';


export default function Profile() {
  const fileRef = useRef(null);
  const { t } = useTranslation();


  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setModalAction(() => async () => {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    });
    setShowModal(true);
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        console.log('Error signing out');
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    setModalAction(() => async () => {
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }

        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
      } catch (error) {
        console.log(error.message);
      }
    });
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    if (modalAction) {
      modalAction();
      setShowModal(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="p-3 pt-20 max-w-lg mx-auto bg-">
    <h1 className="text-3xl font-semibold text-center my-7 dark:text-white uppercase text-slate-500">{t('profile_title')}</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
      <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
      <p className="text-sm self-center dark:text-white">
        {fileUploadError ? (
          <span className="text-red-700 dark:text-red-400">{t('file_upload_error')}</span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700 dark:text-slate-300">{t('uploading')} {filePerc}%</span>
        ) : filePerc === 100 ? (
          <span className="text-green-700 dark:text-green-400">{t('upload_success')}</span>
        ) : (
          ''
        )}
      </p>
      <input onChange={handleChange} defaultValue={currentUser.username} type="text" placeholder={t('username')} id="username" className="focus:outline-none p-3 rounded-lg bg-gray-200 dark:bg-slate-900 text-black dark:text-white" />
      <input onChange={handleChange} defaultValue={currentUser.email} type="email" placeholder={t('email')} id="email" className="focus:outline-none p-3 rounded-lg bg-gray-200 dark:bg-slate-900 text-black dark:text-white" />
      <input onChange={handleChange} type="password" placeholder={t('password')} id="password" className="focus:outline-none p-3 rounded-lg bg-gray-200 dark:bg-slate-900 text-black dark:text-white" />
      <button disabled={loading} className="text-white dark:text-blue-400 bg-blue-900 dark:hover:bg-blue-900 dark:bg-blue-950 rounded-lg p-3 uppercase hover:opacity-95 disabled:placeholder-opacity-70">{loading ? t('loading') : t('update')}</button>
      <Link className="bg-green-950 hover:bg-green-900 dark:text-green-400 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to="/createlisting">
        {t('create_listing')}
      </Link>
    </form>

    <div className="flex justify-between mt-5">
      <span onClick={handleDeleteUser} className="text-red-700 dark:text-red-500 cursor-pointer">{t('delete_account')}</span>
      <span onClick={handleSignOut} className="text-red-700 dark:text-red-500 cursor-pointer">{t('sign_out')}</span>
    </div>
    <p className="text-red-700 dark:text-red-400 mt-5">{error ? error : ''}</p>
    <p className="text-green-700 dark:text-green-400 mt-5">{updateSuccess ? t('user_update_success') : ''}</p>
    <button onClick={handleShowListings} className="text-green-700 dark:text-green-400 w-full">{t('show_listings')}</button>
    <p className="text-red-600 mt-5">{showListingsError ? t('show_listings_error') : ''}</p>
    {userListings &&
      userListings.length > 0 &&
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">{t('your_listings')}</h1>
        {userListings.map((listing) => (
          <div
            key={listing._id}
            className="card border dark:border-slate-600 rounded-lg p-3 flex justify-between items-center gap-4 dark:hover:bg-slate-900"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <p className={`w-full max-w-[120px] text-center p-1 rounded-md ${listing.available ? 'text-white dark:text-white bg-green-800' : (listing.type === 'sale' ? 'bg-red-900 text-white' : 'bg-yellow-500 text-black')}`}>
              {listing.available ? t('available') : (listing.type === 'sale' ? t('sold') : t('rented'))}
            </p>
            <Link
              className="text-slate-700 dark:text-white font-semibold hover:underline truncate flex-1"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col item-center">
              <button onClick={() => handleListingDelete(listing._id)} className="text-red-500 uppercase">{t('delete')}</button>
              <Link to={`/updatelisting/${listing._id}`}>
                <button className="dark:text-green-500 text-green-700 uppercase">{t('edit')}</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    }

    <ConfirmationModal
      show={showModal}
      onClose={handleModalClose}
      onConfirm={handleModalConfirm}
      message={t('delete_confirmation')}
    />
  </div>
  );
}
