import { getSomePosts } from "./prismadb.js";

async function getMostRecent(req,res,next) {
    const posts = await getSomePosts(5);
    res.status(200).json({posts});
}

export { getMostRecent }