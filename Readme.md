### Blog Backend API server
Generates a series of blog posts and random users that the frontend can use if the db is empty. There's a reset prisma 
bash script that seeds the db only when it is empty. <br>
On the landing page, there's a ***freemium*** view of available posts. The post thumbnails are sanitized by the express 
server to include only the first 2 sentences and empty comment objects, so that the frontend can properly render it. The 
post thumbnails have links that redirect to protected routes. If the user is not signed in and they click on any of the 
links, the react frontend redirects the user to the sign in page. <br>
- `Basic` users can view published posts, add comments, and modify comments that they own. 
- `Author` users can view or modify posts that they created in the admin panel view. They can also add new comments or 
    modify comments and posts that they created.
- `Admin` users can view or delete any post or comment. However, they can only edit posts/comments that they created. This 
    seemed logical to me because it's better to delete posts/comments than to alter or misrepresent users views maliciously.

### Signing up with different roles
The signup route extracts the form entries and creates a new role if the case-sensitive role value in the form matches the 
defined role keys in my `config/roles.js` file. If the role value is omitted, a generic user is created by default.
```json
{
    "email": "janedoe54@odinblog.com",
    "password": "...",
    "username": "Jane Doe",
    "role": "..." // optional key which I manually include in the react fetch request.
}
```
The role value is not provided in the form as an input, and I included it manually on the backend. If the role is not included 
the sign up defaults to the basic USER role. If the role does not match my required backend roles, the express server throws 
an error so that malicious users don't inject random roles into the db. 


### Packages
 - [x] @prisma/client
 - [x] @quixo3/prisma-session-store
 - [x] bcryptjs
 - [x] cookie-parser
 - [x] cors
 - [x] crypto
 - [x] dotenv
 - [x] express
 - [x] express-session
 - [x] jsonwebtoken
 - [x] passport
 - [x] passport-jwt
 - [x] passport-local
 - [x] prisma

### Learnings 
1.  Cookie options must always use `Strict` or `lax`. Using `None` would prevent react from detecting the http only jwt cookie.
    ```JS
    const cookieOptions = { 
        sameSite: 'Strict',
        ...
    }
    ```
2. Ensure consistency of error codes or it can quickly become a nightmare especially for refresh tokens. 
    - `401 Unauthorized` should be used when a user is not logged in or doesn't have a valid token.
    - `403 Forbidden` - This means the user is authenticated, but it's not allowed to access a resource e.g. delete,view,update etc.
    - `404 Not Found` - This indicates that a resource is not found e.g. when a comment id is incorrectly associated with a post.
    - `500 Internal server error` - should be reserved for when the server itself is having issues like it can't find the db etc.

3. For react frontend, because the jwt is saved on memory for security purposes, the react server sends regular requests to the 
    express server to persist authentication. Once it receives a 401 error once, it'll retry the `/v1/auth/refresh` route using 
    the jwt cookie to generate a new access token the second time. If it fails twice, it redirects the user to login.

4. For the `basic` blog, I didn't include any keys/roles in my json responses. Checking the authorId against the owner id is 
    sufficient to restrict user permissions. I still haven't figured out how to implement it for the admin panel

5. For sign in, I created 2 separate middlewares that both use passport-local for authorization. The basic one allows any registered
     user to sign in without a role check. The content management site middleware checks that they have the admin or author roles 
    or it throws a 403 Forbidden error because the users exist but they don't have necessary permissions. Even if they do manage to 
    login, the `cms` routes would prevent them from being able to view anything. There's a separate middleware that `generatesJWTs` 
    which is used for authentication moving forward. The same middleware is used for both sign in routes and includes the users ID 
    and role in the JWT.

6. For sign up, The same signup link is used by both parties. Basic users are defaulted to the user role, while content management 
    users are defaulted to the author role. To create a user send a post request to `/v1/auth/signup`. If there's no role key 
    in the request body you're defaulted to a user role, if you include a role like author or admin, you're defaulted to your 
    specified role. All roles use uppercase and are represented as enums with prisma and postgres.


### Environment Variables
Some of them are just for seeding the dummy db.
```bash
DATABASE_URL="..."
JWT_ACCESS_SECRET="..."
JWT_REFRESH_SECRET="..."
SESSION_SECRET="..."
NODE_ENV=".."
PORT=...
ADMIN_PSWD="..."
AUTHOR1_PSWD="..."
USER1_PSWD="..."
```
