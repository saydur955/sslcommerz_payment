import fetch from 'node-fetch';
import { payData } from './paymentdata';

interface IsslPayFetchRes {
  data: any,
  isSucess: boolean
}

export const sslPayFetch = async ():Promise<IsslPayFetchRes> => {

  const payDataStr = payData();

  try {

    if (!payDataStr) {
      throw new Error('store id or password is missing')
    }

    const res = await fetch(
      'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
      {
        method: 'POST',
        body: payDataStr
      });

    const resData = await res.json();

    if (!res.ok ) {
      throw new Error(resData)
    }

    return {
      data: resData,
      isSucess: true
    };

  }
  catch (err) {
    return {
      isSucess: false,
      data: err.message || 'Failed to comlete payment '
    };
  }
}
