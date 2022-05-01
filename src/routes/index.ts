import express from "express";
import ROUTES from "../constants/routes";
import AuthController from "../controllers/authController";
import transactionsController from "../controllers/transactionsController";
import VerifyToken from "../middleware/VerifyToken";

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

export default router;
