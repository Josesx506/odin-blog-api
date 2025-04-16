import { seedUsers } from "./seedUsers.js";
import { seedPostsAndComments, blogPosts } from "./seedPosts.js";
import { prisma } from '../config/prisma.js';

async function seedAll() {
    const userCount = await prisma.blogUser.count();
    if (userCount === 0) {
        await seedUsers();
    }

    const postCount = await prisma.blogPost.count();
    if (postCount === 0) {
        const authorIds = await prisma.blogUser.findMany({
            where: { role: 'AUTHOR' },
            select: { id: true }
        }).then(users => users.map(user => user.id));
        const userIds = await prisma.blogUser.findMany({
            select: { id: true }
        }).then(users => users.map(user => user.id));
        await seedPostsAndComments(blogPosts, authorIds, userIds);
    }
}


seedAll()
    .then(() => console.log("Seeding completed successfully"))
    .catch(err => console.error("Seeding failed:", err))
    .finally(async () => { await prisma.$disconnect() });