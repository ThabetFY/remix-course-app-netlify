import { hash, compare } from "bcrypt";

import { prisma } from "./prisma.server";
import { createCookieSessionStorage, json, redirect } from "@remix-run/node";

const SESSION_SECRET = process.env.SESSION_SECRET || "";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

async function createUserSession(userId: string, redirectUrl: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function destroyUserSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getUserFromSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");

  if (!userId) {
    return null;
  }

  return userId;
}

export async function requireUserSession(request: Request) {
  const userId = await getUserFromSession(request);

  if (!userId) {
    throw redirect("/auth?mode=login");
  }

  return userId;
}

export async function signup({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw json(null, { status: 422, statusText: "Email already in use" });
  }
  const passwordHash = await hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
    },
  });

  return createUserSession(user.id, "/expenses");
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw json(null, { status: 401, statusText: "Invalid credentials" });
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw json(null, { status: 401, statusText: "Invalid credentials" });
  }

  return createUserSession(user.id, "/expenses");
}
