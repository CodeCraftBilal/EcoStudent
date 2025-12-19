import { faker } from '@faker-js/faker';

const IMAGE_SOURCES = [
  'https://picsum.photos/600/600',
  'https://cdn.jsdelivr.net/gh/identicons/jasonlong/assets/images/octocat.png',
  'https://avatars.githubusercontent.com/u/583231?v=4',
];

export function randomImage(): string {
  return faker.helpers.arrayElement(IMAGE_SOURCES);
}

export function randomImages(count = 3): string[] {
  return Array.from({ length: count }, () => randomImage());
}
