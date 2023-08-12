import prismadb from "@/app/lib/prismadb";
import getSession from "./get-session";

export default async function getUsers() {
  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }

  const users = await prismadb.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      NOT: {
        email: session.user.email,
      },
    },
  });

  return users;
}
