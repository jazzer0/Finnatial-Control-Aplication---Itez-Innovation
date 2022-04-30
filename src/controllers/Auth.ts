import { Request, Response } from "express";
import prismaClient from "../config/prismaConfig";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

class AuthController {
  async signIn(req: Request, res: Response) {
    const { email, password, username } = req.body;

    try {
      const user = await prismaClient.user.findFirst({
        where: { username: { equals: username } },
      });

      const verification = await bcrypt.compare(password, user!.password);

      if (!verification) {
        console.log(user);
        return res
          .status(401)
          .json({ message: "Usuário e/ou senha Incorretos" });
      }

      const accessToken = jwt.sign(
        username,
        process.env.ACCESS_TOKEN_SECRET as Secret
      );

      return res.status(200).json({ userData: user, token: accessToken });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, errordata: error });
    }
  }

  async registerIn(req: Request, res: Response) {
    const { email, password, username } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await prismaClient.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      });
      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, errordata: error });
    }
  }
}

export default new AuthController();
