-- DropForeignKey
ALTER TABLE "BlogComment" DROP CONSTRAINT "BlogComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "BlogComment" DROP CONSTRAINT "BlogComment_postId_fkey";

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "BlogUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
