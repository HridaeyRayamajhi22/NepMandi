import React, { use, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import axiostoastrerror from '../utils/axiostoasterror';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const OTPVerification = () => {
  const [data, setData] = useState(['','','','','',''])
  
  const navigate = useNavigate()

  const inputRef = useRef([]);

  const location = useLocation()
  console.log(location)

  useEffect(() => {
    if (!location.state?.email) {
      toast.error("Please enter a valid email address");
      navigate('/forgot-password')
    }
  })

  const validateValues = data.every(el => el)

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();


    setIsLoading(true); // start loader

    try {
      const response = await Axios({
        ...SummaryApi.verifyForgotPasswordOtp ,
        data: {
             otp: data.join(''),
              email: location?.state?.email
        },
      });

      if (response.data.error) {
        toast.error(response.data.message); // show error like "Invalid credentials"
      }

      if (response.data.success) {
        toast.success("Login successful!");
        setShowSuccess(true); // show success message
        setData(['','','','','','']) // clear the input fields
          navigate('/reset-password',{
            state: {
              data : response.data,
              email: location?.state?.email
            }
          })

        
      }
    } catch (error) {
      axiostoastrerror(error);
    } finally {
      setIsLoading(false); // stop loader
    }
  };

  return (
    <section className='w-full container mx-auto px-2 mt-10'>
      <div className='bg-white shadow-xl w-full max-w-lg mx-auto rounded-3xl p-6 border border-gray-200'>
        <h2 className='text-2xl font-bold text-center text-slate-800 mb-1'>
            OTP Verification
        </h2>
        <p className='text-center text-gray-600 mb-4 text-sm'>
            Enter the OTP sent to your email address. 
        </p>

        <form className='grid gap-3 mt-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor="otp" className='text-sm font-medium text-gray-700'>
             Enter your OTP:
            </label>
            <div className="flex items-center gap-2 justify-between mt-3">
                { 
                 data.map((element, index) => {
                    return(
                        <input             
                        key= {"otp"+index}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        ref={(ref)=>{
                            inputRef.current[index] = ref
                    }}
                        
                        value = {data[index]}
                        onChange={(e) => {
                            const value = e.target.value                    
                            const newData = [...data]
                            newData[index] = value
                            setData(newData)
                            if(value && index < 5) {  
                                inputRef.current[index+1].focus()
                            }
                            
                        }}                 
                        id='otp'
                        maxLength={1}
                        className='w-full max-w-16 border border-gray-300 rounded-xl px-4 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-center font-semibold'
                        disabled={isLoading} // Disable input when loading
                      />
                    )
                })
     }              
            </div>
          </div>

          <button
            disabled={!validateValues || isLoading}
            className={`${(!validateValues || isLoading) ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-800'}
              text-slate-100 font-semibold rounded-xl px-4 py-2 mt-4 shadow-md transition transform hover:shadow-lg hover:shadow-green-500/50 hover:scale- duration-200`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
        {isLoading && !showSuccess &&(
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 animate-pulse">Verifying...</p>
          </div>
        )}

        <div className="text-center mt-4 text-sm text-gray-700">
        Didn't receive it ? <Link to="/resend-otp" className="text-green-800 font-bold hover:underline transition-all duration-200">Resend OTP</Link>.{" "}
        </div>
      </div>
    </section>
  )
};

export default OTPVerification
