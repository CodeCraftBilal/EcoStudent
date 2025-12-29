import { PrismaClient, ROLE } from '../../apps/backend/generated/prisma';
import { faker } from '@faker-js/faker';

export async function seedUsers(prisma: PrismaClient, count = 20) {
  const users: Promise<any>[] = [];

  for (let i = 0; i < count; i++) {
    users.push(
      prisma.users.create({
        data: {
          userName: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          role: faker.helpers.arrayElement([ROLE.USER, ROLE.ADMIN]),
          hashedPassword: "123456", // In real scenarios, use a proper hashing function
          phoneNumber: faker.phone.number(),
          profilePicture: faker.image.avatar(),
          userLocation: faker.location.city(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          isVerified: faker.datatype.boolean(),
          createdAt: faker.date.past(),
        },
      }),
    );
  }

  await Promise.all(users);
  console.log('✅ Users seeded');
}
