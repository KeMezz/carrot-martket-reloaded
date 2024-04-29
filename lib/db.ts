import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function test() {
  const users = await db.user.findMany({
    where: {
      username: {
        contains: "est",
      },
    },
  });
  console.log(users);
}

test();

export default db;
