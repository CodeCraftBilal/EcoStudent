import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedUser(count: number = 10) {
  console.log('seeding users...');

  const users: any[] = [];

  for (let i = 0; i <= count; i++) {
    const user = await prisma.users.create({
      data: {
        userName: faker.internet.username(),
        email: faker.internet.email(),
        role: "USER",
        hashedPassword: faker.internet.password(),
        phoneNumber: faker.phone.number(),
        profilePicture: faker.image.avatar(),
        userLocation: faker.location.city(),
        latitude: faker.number.float({
          min: 33.6,
          max: 33.8,
          fractionDigits: 7,
        }),
        longitude: faker.number.float({
          min: 73.0,
          max: 73.3,
          fractionDigits: 7,
        }),
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        isVerified: faker.datatype.boolean(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    users.push(user);
  }
    console.log(`✔ Users Seeded: ${users.length}`);
    return users;
}
