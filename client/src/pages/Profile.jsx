import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
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
import { useDispatch } from 'react-redux';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
        console.log(error)
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
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout')
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        console.log('Error signing out');
        return;
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div className="p-3 pt-20 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 dark:text-white uppercase text-slate-500">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept="image/*" />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className='text-sm self-center dark:text-white'>
          {fileUploadError ? (
            <span className='text-red-700 dark:text-red-400'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700 dark:text-slate-300'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700 dark:text-green-400'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input onChange={handleChange} defaultValue={currentUser.username} type="text" placeholder="username" id="username" className="border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none" />
        <input onChange={handleChange} defaultValue={currentUser.email} type="email" placeholder="email" id="email" className="border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none" />
        <input onChange={handleChange} type="password" placeholder="password" id="password" className="border p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-none" />
        <button disabled={loading} className="bg-slate-700 dark:bg-blue-800 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:placeholder-opacity-70">{loading ? 'Loading...' : 'Update'}</button>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 dark:text-red-500 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 dark:text-red-500 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 dark:text-red-400 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 dark:text-green-400 mt-5">{updateSuccess ? 'User update done' : ''}</p>
    </div>
  )
}
