import { useState } from 'react';
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const [errTxt, setErrTxt] = useState<string|null>(null);

  const paymentHandler = async () => {
    try {
      setIsLoading(true);
      setErrTxt(null);

      const res = await fetch('http://localhost:8000/payment/process');
      const resData = await res.json();
      if(!res.ok) {
        throw new Error(resData.data || 'Fail to complete payment');
      }
      // console.log(resData);
      setIsLoading(false);
      setErrTxt(null);

      if(typeof window !== 'undefined' && resData.data) {
        window.open(resData.data, '_blank');
      }


    } catch(err) {
      setIsLoading(false);
      setErrTxt(err.message);
    }
  }

  return (
    <div className={styles.container}>

      {
        isLoading && <p> loading... </p>
      }
      
      <div>
        <Image alt="pizza" width={280} height={200}
        src="https://cdn.britannica.com/s:800x1000/08/177308-050-94D9D6BE/Food-Pizza-Basil-Tomato.jpg" 
        />
      </div>

      <div>
        <h2> Pizza </h2>
        <p> Amount: 1500 taka </p>
        <button onClick={paymentHandler}
          style={{padding: '5px 15px'}} > 
          payment 
        </button>
      </div>

    </div>
  )
}
