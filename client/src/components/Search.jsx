import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowCircleLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchPage, setIsSearchPage] = useState(false);
    const [isMobile] = useMobile();
    const params = useLocation();
    const searchText = params.search.slice(3);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const isSearch = location.pathname === "/search";
        setIsSearchPage(isSearch);
    }, [location]);

    const redirectToSearchPage = () => {
        navigate("/search");
    };

    const handleOnChange = (e) => {
        const value = e.target.value;
        const url = `/search?q=${value}`;
        navigate(url);
    };

    return (
        <div className={`w-full min-w-[280px] lg:min-w-[415px] sm:h-12 lg:h-14 rounded-xl border-2 overflow-hidden flex items-center transition-all duration-300
            ${isFocused ? 'border-green-500 shadow-lg' : 'border-gray-200 shadow-sm'}
            bg-white hover:shadow-md`}>
            
            {/* Search/Back Button */}
            <div className={`transition-colors duration-300 ${isFocused ? 'text-green-500' : 'text-gray-400'}`}>
                {
                    (isSearchPage && isMobile) ? (
                        <button 
                            className='flex justify-center items-center h-full p-3 hover:text-green-600'
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                        >
                            <FaArrowCircleLeft size={20} />
                        </button>
                    ) : (
                        <button 
                            className='flex justify-center items-center h-full p-3 hover:text-green-600'
                            onClick={redirectToSearchPage}
                            aria-label="Search"
                        >
                            <FaSearch size={20} />
                        </button>
                    )
                }
            </div>
            
            {/* Search Input Area */}
            <div className='w-full h-full flex items-center'>
                {
                    !isSearchPage ? (
                        // Not on search page - Animated placeholder
                        <div 
                            onClick={redirectToSearchPage}
                            className="w-full px-3 py-2 text-gray-400 cursor-text"
                        >
                            <TypeAnimation
                                sequence={[
                                    'Search "clothing"',
                                    1000,
                                    'Search "snacks"',
                                    1000,
                                    'Search "fresh fruits"',
                                    1000,
                                    'Search "pet supplies"',
                                    1000,
                                    'Search "chocolates"',
                                    1000,
                                    'Search "cold drinks"',
                                    1000,
                                    'Search "rice"',
                                    1000,
                                    'Search "bags"',
                                    1000,
                                ]}
                                wrapper="span"
                                speed={46}
                                style={{ fontSize: '0.95rem', display: 'inline-block' }}
                                repeat={Infinity}
                            />
                        </div>
                    ) : (
                        // When on search page - Actual input
                        <div className='w-full text-left px-3'>
                            <input
                                type='text'
                                className='w-full h-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm sm:text-base'
                                placeholder='Search for Atta Dal and more...'
                                autoFocus
                                defaultValue={searchText}
                                onChange={handleOnChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                aria-label="Search input"
                            />
                        </div>
                    )
                }
            </div>
            
            {/* Optional: Clear button could be added here when there's text */}
        </div>
    );
};

export default Search;