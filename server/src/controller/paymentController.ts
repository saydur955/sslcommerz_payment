import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import { sslPayFetch } from '../ssl/paymentFetch';

interface IPaymentScsVerReq extends Request {
  sslczInfo: {
    valId: string;
  }
}

interface IPaymentCls {
  paymentProcess(req: Request, res: Response): Promise<void>;
  paymentSucess(req: Request, res: Response, next: NextFunction): void;
  paymentVerify(req: Request, res: Response): Promise<void>;
}

class PaymentCls implements IPaymentCls {

  static Payment (): PaymentCls {
    return new PaymentCls()
  }

  // ====================== payment process =============================
  async paymentProcess (req: Request, res: Response): Promise<void> {

    try {

      const payRes = await sslPayFetch();

      if(!payRes.isSucess) {
        throw new Error(payRes.data)
      }

      res.status(200).json({
        status: 'success',
        data: payRes.data.GatewayPageURL
      })

    } catch (err) {
      res.status(400).json({
        status: 'fail',
        data: err.message || 'Fail to complete payment'
      })
    }

  }


  // ====================== payment sucess =============================
  paymentSucess(req: IPaymentScsVerReq, res: Response, next: NextFunction): void {

    if(req.body.val_id) {
      req.sslczInfo = {
        valId: req.body.val_id
      }
      return next();
    }

    res.status(500).json({
      status: 'Fail',
      data: 'Failed to update ammount on database',
    })

  }

  // ====================== payment verify =============================
  async paymentVerify(req: IPaymentScsVerReq, res: Response): Promise<void> {
    try {

      const keyData = {
        val_id: req.sslczInfo.valId,
        store_id: process.env.SSL_STORE_ID,
        store_passwd: process.env.SSL_STORE_PASS,
      };

      const query =
        `val_id=${keyData.val_id}&store_id=${keyData.store_id}&store_passwd=${keyData.store_passwd}`;

      const payDataRes = await fetch(
        `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?${query}`
      );
      const payData = await payDataRes.json();

      if(!payDataRes.ok || !payData.tran_id ||
         payData.status === 'INVALID_TRANSACTION' ) {
        throw new Error('Failed to update ammount');
      }

      /*
      
        needed code to update amount on db
        payment id on db is: payData.tran_id

      */
        

      res.status(200).json({
        status: 'success',
        message: 'Amount updated'
      })
    } catch (err) {
      res.status(500).json({
        status: 'failed',
        message: 'Failed to update ammount'
      })
    }
  }

}

export const PaymentController: IPaymentCls = PaymentCls.Payment();