import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';

export const payData = (): FormData | null => {

  if(!process.env.SSL_STORE_ID || !process.env.SSL_STORE_PASS ) {
    return null;
  }

  const paymentData: { [key: string]: string | number } = {

    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASS,
    tran_id: uuidv4(), // payment id of your db
    total_amount: 1500,
    currency: 'BDT',

    success_url: 'http://localhost:8000/payment/success',
    fail_url: 'http://localhost:3000/payment/fail',
    cancel_url: 'http://localhost:3000/payment/cancel',

    emi_option: 1,

    cus_name: 'test customer',
    cus_email: 'test@gmail.com',
    cus_add1: 'test address',
    cus_city: 'test city',
    cus_postcode: '123',
    cus_country: 'Bangladesh',
    cus_phone: '01XXXXXXXXX',

    shipping_method: 'NO',
    num_of_item: 1,

    product_name: 'Pizza',
    product_category: 'Food',
    product_profile: 'general',

  };
  const paymentFormData = new FormData();
  Object.keys(paymentData).forEach(el => {
    paymentFormData.append(el, paymentData[el]);
  })
  return paymentFormData;
};