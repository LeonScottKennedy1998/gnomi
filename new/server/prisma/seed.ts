import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.resolve(__dirname, "..", "..", "data", "content.json");
  const raw = await fs.readFile(dataPath, "utf8");
  const content = JSON.parse(raw);

  const payload = JSON.stringify(content);

  await prisma.content.upsert({
    where: { id: 1 },
    create: { id: 1, data: payload },
    update: { data: payload }
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
