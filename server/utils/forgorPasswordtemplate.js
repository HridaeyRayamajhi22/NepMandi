const forgotPasswordTemplate = ({name, otp }) => {
     return `
   <div>
       <p>Dear, ${name}</p>
       <p>You've requested a password reset.
        Please use the following OTP to reset your password:</p>
       <h2 style="background: yellow; font-size:20px; padding:20px; text-align:center"; font-weight: 800; >${otp}</h2>
       </p>
        <p>This OTP is valid for 1 hour only. Enter this OTP in the NepMandi website to 
        proceed with resetting your password</p>
        <br />
        </ br >
        <p>Thanks</p>
        <p>NepMandi</p>
   </div>  
  `
}
export default forgotPasswordTemplate