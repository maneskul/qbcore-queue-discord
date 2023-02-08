import prisma from "../../src/prisma/prismaClient";

export class QueueRepository {
  async register(name: string, discordId: string) {
    const user = await prisma.queue.findFirst({
      where: {
        discordId,
      },
    });

    if (user) {
      const updateUser = await prisma.queue.update({
        where: {
          id: user.id,
        },
        data: {
          updatedAt: new Date(Date.now()),
        },
      });
    } else {
      await prisma.queue.create({
        data: {
          discordId,
          name,
        },
      });
    }
  }
}
