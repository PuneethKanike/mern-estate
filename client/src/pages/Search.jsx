import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ListingItem from "../components/ListingItem";

export default function Search() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
        bedrooms: 1,
        bathrooms: 1,
        beds: '',
        baths: ''
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
        const bedsFromUrl = urlParams.get('beds');
        const bathsFromUrl = urlParams.get('baths');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl ||
            bedsFromUrl ||
            bathsFromUrl
        ){
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
                beds: bedsFromUrl || '',
                baths: bathsFromUrl || ''
            })
        }

        const fetchListings = async (page) => {
            setLoading(true);
            const searchQuery = new URLSearchParams(urlParams);
            searchQuery.set('startIndex', page * 6);
            searchQuery.set('limit', 6);
            const res = await fetch(`/api/listing/get?${searchQuery.toString()}`);
            const data = await res.json();
            setListings(data);
            setLoading(false);
            setHasNextPage(data.length === 6);
            setHasPreviousPage(page > 0);
        };

        fetchListings(currentPage);
    }, [location.search, currentPage]);

    const handleChange = (e) => {
        if (
            e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sale'
        ) {
            setSidebardata({ ...sidebardata, type: e.target.id });
        }

        if (e.target.id === 'searchTerm' || e.target.id === 'beds' || e.target.id === 'baths') {
            setSidebardata({ ...sidebardata, [e.target.id]: e.target.value });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setSidebardata({
                ...sidebardata,
                [e.target.id]: e.target.checked ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({ ...sidebardata, sort, order });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        urlParams.set('beds', sidebardata.beds);
        urlParams.set('baths', sidebardata.baths);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
        setCurrentPage(0); // Reset to the first page on new search
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className='flex flex-col md:flex-row pt-20'>
            <div className='p-7 md:min-h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>{t('searchTerm')}</label>
                        <input
                            type='text'
                            id='searchTerm'
                            placeholder={t('search_term_placeholder')}
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                            className='border dark:border-none focus:outline-none rounded-lg p-3 w-full dark:bg-slate-900 dark:hover:bg-slate-800'
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>{t('beds')}</label>
                        <input
                            type='number'
                            id='beds'
                            placeholder={t('beds_placeholder')}
                            value={sidebardata.beds}
                            onChange={handleChange}
                            min='1'
                            max='10'
                            className='border dark:border-none focus:outline-none rounded-lg p-3 w-full dark:bg-slate-900 dark:hover:bg-slate-800'
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>{t('baths')}</label>
                        <input
                            type='number'
                            id='baths'
                            min='1'
                            max='10'
                            placeholder={t('baths_placeholder')}
                            value={sidebardata.baths}
                            onChange={handleChange}
                            className='border dark:border-none focus:outline-none rounded-lg p-3 w-full dark:bg-slate-900 dark:hover:bg-slate-800'
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>{t('type')}</label>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='all' className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'all'}
                            />
                            <span>{t('type_all')}</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'rent'}
                            />
                            <span>{t('type_rent')}</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'sale'}              
                            />
                            <span>{t('type_sale')}</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' 
                                onChange={handleChange}
                                checked={sidebardata.offer}
                            />
                            <span>{t('offer')}</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>{t('amenities')}</label>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.parking}
                            />
                            <span>{t('parking')}</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5' 
                                onChange={handleChange}
                                checked={sidebardata.furnished}
                            />
                            <span>{t('furnished')}</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>{t('sort')}</label>
                        <select id='sort_order' className='border dark:border-none focus:outline-none rounded-lg p-3 dark:bg-slate-900 dark:hover:bg-slate-800'
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                        >
                            <option value='regularPrice_desc'>{t('price_high_to_low')}</option>
                            <option value='regularPrice_asc'>{t('price_low_to_high')}</option>

                            <option value='createdAt_desc'>{t('latest')}</option>
                            <option value='createdAt_asc'>{t('oldest')}</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                        {t('search_button')}
                    </button>
                </form>
            </div>
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold p-3 text-slate-700 mt-5 dark:text-slate-400'>{t('search_title')}</h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>{t('no_listings_found')}</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>
                            {t('loading_text')}
                        </p>
                    )}

                    {!loading &&
                        listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}

                    <div className='w-full flex justify-center gap-5 mt-5'>
                        {hasPreviousPage && (
                            <button
                                onClick={handlePreviousPage}
                                className='text-green-700 hover:underline'
                            >
                                {t('previous_button')}
                            </button>
                        )}
                        {hasNextPage && (
                            <button
                                onClick={handleNextPage}
                                className='text-green-700 hover:underline'
                            >
                                {t('next_button')}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
