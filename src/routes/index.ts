import express from "express";
import ROUTES from "../constants/routes";
import AuthController from "../controllers/authController";
import TransactionsController from "../controllers/transactionsController";
import VerifyToken from "../middleware/VerifyToken";

const transactionsController = new TransactionsController();
const router = express.Router();
const authController = new AuthController();

router.route(ROUTES.LOGIN).post(authController.signIn);
router.route(ROUTES.LOGOUT).delete(authController.logOut);
router.route(ROUTES.REGISTER).post(authController.registerIn);
router.route(ROUTES.TOKEN).post(authController.getToken);
router
  .route(ROUTES.TRANSACTIONS)
  .get(transactionsController.getAll)
  .post(transactionsController.create)
  .put(transactionsController.edit)
  .delete(transactionsController.delete);
router.route(ROUTES.EXTRATO).get(transactionsController.extrato);

export default router;
