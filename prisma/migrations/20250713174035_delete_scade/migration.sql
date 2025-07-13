-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_collectionId_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
