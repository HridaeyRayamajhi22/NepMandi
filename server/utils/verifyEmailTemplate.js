const verifyEmailTemplate = ({name, url}) => {
    return ` 
    <p>Thank you for registering with NepMandi</p>
    <a href= ${url} style="color:white; background-color: #4CAF50; padding: 10px 20px;
    text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px;">
    Verify Email
    </a>

    `
}
export default verifyEmailTemplate;