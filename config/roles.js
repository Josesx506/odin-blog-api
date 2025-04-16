
const ROLES = {
    ADMIN: [
        "view:allPosts",
        "view:posts",
        "create:posts",
        "update:ownPost",
        "delete:posts",
        "view:comments",
        "create:comments",
        "update:ownComment",
        "delete:comments",
    ],
    AUTHOR: [
        "view:ownPosts",
        "view:posts",
        "create:posts",
        "update:ownPost",
        "delete:ownPost",
        "view:comments",
        "create:comments",
        "update:ownComment",
        "delete:ownComment"
    ],
    USER: [
        "view:posts",
        "view:comments",
        "create:comments",
        "update:ownComment",
        "delete:ownComment"
    ]
}


export { ROLES };