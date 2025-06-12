import React,{ useState, useEffect } from 'react';

const useMobile = (breakpoint = 768) =>{
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= breakpoint);
    }; 

    useEffect(() => {
        handleResize(); // Check on mount
        window.addEventListener('resize', handleResize);


        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[]);

    return [isMobile];  
}
export default useMobile;