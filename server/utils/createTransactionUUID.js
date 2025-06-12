// utils/createTransactionUUID.js

const createTransactionUUID = () => {
  const now = new Date();
  return (
    now.toISOString().slice(2, 10).replace(/-/g, '') +
    '-' +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0')
  );
};

export default createTransactionUUID;
