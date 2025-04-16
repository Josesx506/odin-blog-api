import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import 'dotenv/config';
import { prisma } from '../config/prisma.js';

const hashes = crypto.randomBytes(64).toString('hex').match(/.{1,7}/g);
const adminPswd = process.env.ADMIN_PSWD;
const author1Pswd = process.env.AUTHOR1_PSWD;
const user1Pswd = process.env.USER1_PSWD;

const USERNAMES = [
    "Jodin Blog","Alan Connor","Alexis Amelia","John Doe",
    "Claire Bernandette","Adrian Cameron","Irene Sebastain"
];
const EMAILS = USERNAMES.map(uname=>`${uname.toLowerCase().replace(/ /g,"")}@odinblog.com`);
const authr2pswd = `author2Blog@${hashes[0]}`;
const userPswds = hashes.slice(1,4).map((hash,idx)=>`user${idx+2}Blog@${hash}`);
const PSWDS = [adminPswd,author1Pswd,authr2pswd,user1Pswd,...userPswds];
const HASHED = PSWDS.map(
    async (pswd) => {
      const hashedPassword = await bcrypt.hash(pswd, 10);
      return hashedPassword
    }
);

const ROLES = ["ADMIN","AUTHOR","AUTHOR","USER","USER","USER","USER"];

const users = {
    "usernames": USERNAMES,
    "emails": EMAILS,
    "roles": ROLES,
}


async function seedUsers() {
    try {
        const num = users.usernames.length;
        const hashedPasswords = await Promise.all(HASHED);
        for (let idx=0; idx<num; idx++) {
            let username = users.usernames[idx];
            let email = users.emails[idx];
            let password = hashedPasswords[idx];
            let role = users.roles[idx];

            const entry = await prisma.blogUser.upsert({
                where: {
                    email: email,
                },
                update: {
                    password: password,
                },
                create: {
                    name: username,
                    email: email,
                    password: password,
                    role: role,
                }
            })
        }
        console.log(`User database has been seeded. 🌱`);
    } catch(err) {
        throw err;
    }
}


export { seedUsers };