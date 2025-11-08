/*
  Warnings:

  - You are about to drop the column `user_id` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Parent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_user_id_fkey";

-- DropIndex
DROP INDEX "public"."Student_user_id_key";

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "user_id";

-- CreateIndex
CREATE UNIQUE INDEX "Parent_user_id_key" ON "Parent"("user_id");

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
