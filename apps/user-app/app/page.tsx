import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Page() {
  return <div className="text-2xl">hello world</div>;
}