import { allowedOrigins } from "../config/options.js";


function credentials(req, res, next) {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

export { credentials }