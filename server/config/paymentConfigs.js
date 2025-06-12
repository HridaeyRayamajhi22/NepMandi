export const esewaConfig = {
  merchantId: process.env.ESEWA_MERCHANT_ID,
  secret: process.env.ESEWA_SECRET,
  successUrl: process.env.ESEWA_SUCCESS_URL,
  failureUrl: process.env.ESEWA_FAILURE_URL,
  esewaPaymentUrl: process.env.ESEWAPAYMENT_URL,
};

export const khaltiConfig = {
  secret: process.env.KHALTI_SECRET,
  websiteUrl: process.env.CLIENT_URL,
  returnUrl: `${process.env.CLIENT_URL}/success?method=khalti`,
};