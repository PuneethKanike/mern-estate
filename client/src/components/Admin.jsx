import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listing/admin/all');
        const data = await res.json();
        setListings(data);
      } catch (error) {
        setError('Error fetching listings');
      }
    };

    fetchListings();
  }, []);

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const res = await fetch(`/api/listing/admin/delete/${listingId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
      } catch (error) {
        setError('Error deleting listing');
      }
    } else {
      console.log('Delete action cancelled.');
    }
  };

  return (
    <div className="p-3 pt-20 max-w-lg mx-auto bg-">
      <h1 className="text-3xl font-semibold text-center my-7 dark:text-white uppercase text-slate-500">
        💀
      </h1>
      {error && <p className="text-red-700 dark:text-red-400">{error}</p>}
      {listings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="  rounded-lg p-3 flex justify-between items-center gap-4 dark:hover:bg-slate-900"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 dark:text-white font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="text-red-500 uppercase"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No listings found</p>
      )}
    </div>
  );
};

export default Admin;
