import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import { paymentRouter } from './router/paymentRouter'

dotenv.config({
  path: './config.env'
})

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(cors({
  origin: 'http://localhost:3000'
}))

app.use('/payment', paymentRouter);


app.listen( process.env.PORT || 8000);