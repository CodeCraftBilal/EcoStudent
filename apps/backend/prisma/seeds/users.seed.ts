import { PrismaClient, ROLE } from '../../generated/prisma';
import { faker } from '@faker-js/faker';

export async function seedUsers(prisma: PrismaClient, count = 20) {
  const users: Promise<any>[] = [];

  const baseLat = 33.54;
  const baseLng = 73.14;

  const DELTA = 0.05; // small change, not far

  for (let i = 0; i < count; i++) {
    users.push(
      prisma.users.create({
        data: {
          userName: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          role: faker.helpers.arrayElement([ROLE.USER, ROLE.ADMIN]),
          hashedPassword:
            '$argon2id$v=19$m=65536,t=3,p=4$wxzkqbeXRR2dLX91rJrZsQ$bhNd5nOimzomFaaPtqkErHQD4wVKrYzeSkiLxXgRJoA',
          phoneNumber: faker.phone.number(),
          profilePicture: faker.image.avatar(),
          userLocation: faker.location.city(),
          latitude: faker.number.float({
            min: baseLat - DELTA,
            max: baseLat + DELTA,
            fractionDigits: 6,
          }),

          longitude: faker.number.float({
            min: baseLng - DELTA,
            max: baseLng + DELTA,
            fractionDigits: 6,
          }),
          isVerified: false,
          createdAt: faker.date.past(),
        },
      }),
    );
  }

  await Promise.all(users);
  console.log('✅ Users seeded');
}

// {
//     "accuracy": 50000,
//     "latitude": 33.54,
//     "longitude": 73.14,
//     "altitude": null,
//     "altitudeAccuracy": null,
//     "heading": null,
//     "speed": null
// }

export async function updateLocation(prisma:PrismaClient, latitude = 33.54, longitude = 73.14) {
  const users = await prisma.users.findMany();
  const baseLat = latitude;
  const baseLng = longitude;

  const DELTA = 0.05; // small change, not far
  
    console.log('seeding update locaton')
  users.forEach( async (user) => {
    console.log('updating user')
    await prisma.users.update({
      where: {
        userId: user.userId,
      },
      data: {
        latitude: faker.number.float({
            min: baseLat - DELTA,
            max: baseLat + DELTA,
            fractionDigits: 6,
          }),

          longitude: faker.number.float({
            min: baseLng - DELTA,
            max: baseLng + DELTA,
            fractionDigits: 6,
          }),
      }
    })
  })
  console.log('update seeding completed')

}
