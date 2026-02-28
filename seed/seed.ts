// import { PrismaClient } from '../generated/prisma/client';
// import { faker } from '@faker-js/faker';

// const prisma = new PrismaClient();

// async function main() {
//     console.log('seeding db...')
//   const users: any[] = [];

//   for (let i = 0; i <= 5; i++) {
//     const user = await prisma.users.create({
//       data: {
//         userName: faker.internet.username(),
//         email: faker.internet.email(),
//         role: 'USER',
//         hashedPassword: faker.internet.password(),
//         phoneNumber: faker.phone.number(),
//         profilePicture: faker.image.avatar(),
//         userLocation: faker.location.city(),
//         latitude: faker.number.float({
//           min: 33.6,
//           max: 33.8,
//           fractionDigits: 7,
//         }),
//         longitude: faker.number.float({
//           min: 73.0,
//           max: 73.3,
//           fractionDigits: 7,
//         }),
//         rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
//         isVerified: faker.datatype.boolean(),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });
//     users.push(user);
//   }
//   // seeding products

//   const products: any = [];

//   for (let i = 0; i < 50; i++) {
//     const pickedUser = faker.helpers.arrayElement(users);

//     const product = await prisma.product.create({
//       data: {
//         userId: pickedUser.userId,
//         categoryId: faker.helpers.arrayElement([1, 2, 3, 4, 5]), // change this if you have categories seeded
//         title: faker.commerce.productName(),
//         description: faker.commerce.productDescription(),
//         price: faker.number.float({ min: 500, max: 5000, fractionDigits: 2 }),
//         originalPrice: faker.number.int({ min: 1000, max: 9000 }),
//         images: [faker.image.urlPicsumPhotos()],
//         viewCount: faker.number.int({ min: 0, max: 500 }),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         productCondition: faker.helpers.arrayElement([
//           'excellent',
//           'good',
//           'fair',
//         ]),
//         productType: faker.helpers.arrayElement([
//           'books',
//           'bags',
//           'uniforms',
//           'calculators',
//           'geomatry',
//           'other',
//         ]),
//         exchangeType: faker.helpers.arrayElement([
//           'sale',
//           'exchange',
//           'donation',
//         ]),
//       },
//     });

//     products.push(product);
//   }
//   console.log('products seeded')
// }

// main()
//   .catch((e) => {
//     console.log(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect();
//   });
