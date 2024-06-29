import { FaInstagram,  FaWhatsapp, FaLinkedinIn, FaGithubAlt } from 'react-icons/fa';
function About() {
    return (
        <div className='py-20 px-4 max-w-6xl mx-auto z-0'>
            <h1 className='text-3xl font-bold mb-4 text-slate-800 dark:text-blue-300'>About LiveLink</h1>
            <p className='mb-4 text-slate-700 dark:text-white'>
                Welcome to LiveLink, your premier destination for seamless consumer-to-consumer real estate transactions. Our mission is to simplify the process of buying, renting, and listing properties by providing an intuitive, secure, and comprehensive platform.
            </p>
            <p className='mb-4 text-slate-700 dark:text-white'>
                At LiveLink, we understand the challenges faced in the traditional real estate market, such as fragmented listings, inefficient communication, and trust issues. That is why we have created a platform that brings together advanced search functionalities, integrated messaging systems, and robust listing management tools, all in one place. Whether you are a property seeker looking for your next home or a landlord wanting to list your property, LiveLink offers a user-friendly experience tailored to your needs.
            </p>
            <p className='mb-4 text-slate-700 dark:text-white'>
                Our innovative platform leverages the latest web technologies, including the powerful MERN stack (MongoDB, Express.js, React, and Node.js), to ensure a smooth and efficient experience for all users. With features like Google OAuth for quick login, advanced property filters, and direct messaging integrated with email, we make real estate transactions simpler and more accessible.
            </p>
            <p className='mb-4 text-slate-700 dark:text-white'>
                Join us at LiveLink and experience a new way of connecting with the real estate market. Your next home is just a click away.
            </p>

            <h2 className='text-2xl font-bold mt-12 mb-6 text-slate-800 dark:text-blue-300'>Manual</h2>
            <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                <div className='flex flex-col items-center'>
                    {/* <img src='image1.jpg' alt='Home Page' className='w-full h-auto mb-4 rounded-lg shadow-md' /> */}
                    <p className='text-slate-700 dark:text-white'>The Home Page provides an overview of all the latest property listings. You can browse through featured listings and get a quick snapshot of what is available.</p>
                </div>
                <div className='flex flex-col items-center'>
                    {/* <img src='image2.jpg' alt='Search Page' className='w-full h-auto mb-4 rounded-lg shadow-md' /> */}
                    <p className='text-slate-700 dark:text-white'>Use the Search Page to find properties that match your specific criteria. Filter results by location, price, type, and more to find the perfect home or rental.</p>
                </div>
                <div className='flex flex-col items-center'>
                    {/* <img src='image3.jpg' alt='Sign Up Page' className='w-full h-auto mb-4 rounded-lg shadow-md' /> */}
                    <p className='text-slate-700 dark:text-white'>The Sign Up Page allows new users to create an account easily. You can sign up using your email or quickly log in with your Google account.</p>
                </div>
                <div className='flex flex-col items-center'>
                    {/* <img src='image4.jpg' alt='Property Listing Page' className='w-full h-auto mb-4 rounded-lg shadow-md' /> */}
                    <p className='text-slate-700 dark:text-white'>The Property Listing Page enables landlords to list their properties. Fill in the details, upload images, and submit the listing for others to view.</p>
                </div>
                <div className='flex flex-col items-center'>
                    {/* <img src='image5.jpg' alt='Profile Page' className='w-full h-auto mb-4 rounded-lg shadow-md' /> */}
                    <p className='text-slate-700 dark:text-white'>On the Profile Page, users can manage their personal information, view their listings, and make edits or deletions as needed.</p>
                </div>
                <div className='flex flex-col items-center'>
                    {/* <img src='image6.jpg' alt='Contact Landlord' className='w-full h-auto mb-4 rounded-lg shadow-md' /> */}
                    <p className='text-slate-700 dark:text-white'>Use the integrated messaging system to contact landlords directly from the property listings. Messages are sent to the landlords email for seamless communication.</p>
                </div>
            </div>

            <h2 className='text-2xl font-bold mt-12 mb-6 text-slate-800 dark:text-blue-300 text-center'>Want to contact me?</h2>
            <div className='flex flex-col items-center text-center'>
                <p className='mb-4 text-slate-700 dark:text-white'><strong>Name:</strong> Puneeth K</p>
                <p className='mb-4 text-slate-700 dark:text-white'><strong>Profession:</strong> Web Developer</p>
                <p className='mb-4 text-slate-700 dark:text-white'><strong>Phone:</strong> +917975187240</p>
                <p className='mb-4 text-slate-700 dark:text-white'><strong>Email:</strong> kanike.puneeth@gmail.com</p>
                <div className='flex space-x-4 mt-4'>
                    <a href='https://instagram.com/k_puneeth_gowda' className='rounded text-slate-700 dark:text-white hover:bg-slate-700 hover:text-white dark:hover:bg-white dark:hover:text-black ' target='_blank' rel='noopener noreferrer'><FaInstagram className='text-2xl' /></a>
                    <a href='https://github.com/PuneethKanike' className='rounded text-slate-700 dark:text-white hover:bg-slate-700 hover:text-white dark:hover:bg-white dark:hover:text-black ' target='_blank' rel='noopener noreferrer'><FaGithubAlt className='text-2xl' /></a>
                    <a href='https://wa.me/7975187240' className='rounded text-slate-700 dark:text-white hover:bg-slate-700 hover:text-white dark:hover:bg-white dark:hover:text-black ' target='_blank' rel='noopener noreferrer'><FaWhatsapp className='text-2xl' /></a>
                    <a href='https://linkedin.com/in/puneeth-kanike' className='rounded text-slate-700 dark:text-white hover:bg-slate-700 hover:text-white dark:hover:bg-white dark:hover:text-black ' target='_blank' rel='noopener noreferrer'><FaLinkedinIn className='text-2xl' /></a>
                </div>
            </div>
        </div>
    );
}

export default About;
