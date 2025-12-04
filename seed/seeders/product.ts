import {
  PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seedProducts(users: any[], count: number = 20) {
  console.log("📦 Seeding Products...");

  const products: any = [];

  for (let i = 0; i < count; i++) {
    const pickedUser = faker.helpers.arrayElement(users);

    const product = await prisma.product.create({
      data: {
        userId: pickedUser.userId,
        categoryId: null, // change this if you have categories seeded
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.float({ min: 500, max: 5000, fractionDigits: 2 }),
        originalPrice: faker.number.int({ min: 1000, max: 9000 }),
        images: [faker.image.urlPicsumPhotos()],
        viewCount: faker.number.int({ min: 0, max: 500 }),
        createdAt: new Date(),
        updatedAt: new Date(),
        productCondition: faker.helpers.arrayElement([
          "excellent",
          "good",
          "fair"
        ]),
        productType: faker.helpers.arrayElement([
          "books",
          "bags",
          "uniforms",
          "calculators",
          "geomatry",
          "other",
        ]),
        exchangeType: faker.helpers.arrayElement([
          "sale",
          "exchange",
          "donation"
        ]),
      },
    });

    products.push(product);
  }

  console.log(`✔ Products Seeded: ${products.length}`);
  return products;
}
