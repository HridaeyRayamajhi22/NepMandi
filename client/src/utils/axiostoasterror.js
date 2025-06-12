import toast from 'react-hot-toast';
const axiostoastrerror = (error) => {
    toast.error(
        error?.response?.data?.message, {
    });
}
export default axiostoastrerror