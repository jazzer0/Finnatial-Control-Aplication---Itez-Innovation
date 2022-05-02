import { Request, Response } from "express";
import prismaClient from "../config/prismaConfig";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

let refreshTokens: string[] = [];

const generateAccessToken = (user: any) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as Secret, {
    expiresIn: "10m",
  });

export async function signIn(req: Request, res: Response) {
  const { password, username } = req.body;

  try {
    const user = await prismaClient.user.findFirst({
      where: { username: { equals: username } },
    });

    const verification = await bcrypt.compare(password, user!.password);

    if (!verification) {
      console.log(user);
      return res.status(401).json({ message: "Usuário e/ou senha Incorretos" });
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = jwt.sign(
      user as Record<string, any>,
      process.env.REFRESH_TOKEN_SECRET as Secret
    );
    refreshTokens.push(refreshToken);

    return res
      .status(200)
      .json({ userData: user, token: accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, errordata: error });
  }
}

export async function registerIn(req: Request, res: Response) {
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

export async function getToken(req: Request, res: Response) {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as Secret,
    (error: any, user: any) => {
      if (error) return res.sendStatus(407);
      const accessToken = generateAccessToken({ name: user.name });
      res.json({ accessToken: accessToken });
    }
  );
}

export async function logOut(req: Request, res: Response) {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
}
