import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

function VerifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ message: "Token Expirado" });

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret);
    // req.user = user;
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }

  next();
}

export default VerifyToken;
