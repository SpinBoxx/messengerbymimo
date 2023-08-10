import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prismadb from "@/app/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, password } = body;

  if (!email)
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  if (!name)
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  if (!password)
    return NextResponse.json(
      { message: "Password is required" },
      { status: 400 }
    );

  const hashedPassword = await bcrypt.hash(password, 12);
  const userAlreadyExist = await prismadb.user.findMany({
    where: {
      email,
    },
  });

  if (userAlreadyExist.length !== 0)
    return NextResponse.json(
      { message: "User with this email already exist." },
      { status: 400 }
    );
  const user = await prismadb.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });
  return NextResponse.json(user, { status: 201 });
}
