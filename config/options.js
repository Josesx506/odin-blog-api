import 'dotenv/config';


const allowedOrigins = [
    'http://localhost:1800',
    'http://localhost:1900',
    'https://odin-blog-cms.vercel.app',
    'https://odin-blog-views.vercel.app'
]

const cookieOptions = { 
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
}

const corsOptions = { 
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback( new Error("Not allowed by cors"))
        }
    },
    optionsSuccessStatus: 200
}

export { allowedOrigins, corsOptions, cookieOptions }