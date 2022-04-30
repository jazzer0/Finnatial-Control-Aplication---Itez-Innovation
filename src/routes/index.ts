import express from "express";
import ROUTES from "../constants/routes";
import AuthController from "../controllers/Auth";
import VerifyToken from "../middleware/VerifyToken";

const router = express.Router();

router.route(ROUTES.LOGIN).post(AuthController.signIn);
router.route(ROUTES.TRANSACTIONS).get(VerifyToken, () => {
  console.log("SIM");
});
router.route(ROUTES.REGISTER).post(AuthController.registerIn);

export default router;
