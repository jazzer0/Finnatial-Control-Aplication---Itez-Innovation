import express from "express";
import ROUTES from "../constants/routes";
import TransactionsController from "../controllers/transactionsController";
import VerifyToken from "../middleware/VerifyToken";
import {
  getToken,
  logOut,
  registerIn,
  signIn,
} from "../controllers/authController";

const transactionsController = new TransactionsController();
const router = express.Router();

router.route(ROUTES.LOGIN).post(signIn);
router.route(ROUTES.LOGOUT).delete(logOut);
router.route(ROUTES.REGISTER).post(registerIn);
router.route(ROUTES.TOKEN).post(getToken);
router
  .route(ROUTES.TRANSACTIONS)
  .get(VerifyToken, transactionsController.getAll)
  .post(VerifyToken, transactionsController.create)
  .put(VerifyToken, transactionsController.edit)
  .delete(VerifyToken, transactionsController.delete);
router.route(ROUTES.EXTRATO).get(VerifyToken, transactionsController.extrato);

export default router;
