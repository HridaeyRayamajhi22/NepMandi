const generateOtp = ()=>{
    return Math.floor(Math.random() * 900000) + 100000; // Generates a 6-digit OTP
}
export default generateOtp;