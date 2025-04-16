import 'dotenv/config';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import expressSession from 'express-session';
import { prisma } from './prisma.js';

const prismaSessStore = new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
      sessionModelName: 'blogSession'
    }
);

const sessionMiddleware = expressSession({
    cookie: {maxAge: 24 * 60 * 60 * 1000}, // 24h in ms 
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: prismaSessStore,
});


export { sessionMiddleware }