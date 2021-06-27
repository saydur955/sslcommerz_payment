import { Router } from 'express';
import { PaymentController as Payment } from '../controller/paymentController';


const router = Router();

// ========== payment complete ==========
router.get(
  '/process',
  Payment.paymentProcess.bind(Payment)
)

// ========== payment success ==========
router.post(
  '/success',
  Payment.paymentSucess.bind(Payment),
  Payment.paymentVerify.bind(Payment)
)

export const paymentRouter = router;