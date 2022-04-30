import { Request, Response } from "express";
import prismaClient from "../config/prismaConfig";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

class AuthController {
  public tokens: string[] = [];

  async signIn(req: Request, res: Response) {
    console.log(this.tokens);
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
        user as Record<string, any>,
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: "5s" }
      );

      const refreshToken = jwt.sign(
        user as Record<string, any>,
        process.env.REFRESH_TOKEN_SECRET as Secret
      );

      this.tokens.push(accessToken);

      return res
        .status(200)
        .json({ userData: user, token: accessToken, refreshToken });
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

  async getToken(req: Request, res: Response) {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (refreshToken.includes(refreshToken)) return res.sendStatus(403);
    try {
      const user = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as Secret
      );

      const generateAccessToken = jwt.sign(
        user as Record<string, any>,
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: "5s" }
      );
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }
  }

  async logOut(req: Request, res: Response) {
    return console.log("ss fon");
  }
}

export default AuthController;
