/*
  Warnings:

  - The values [SISTER,BROTHER,GRANDFATHER,GRANDMOTHER] on the enum `RelationshipToStudent` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `StudentParentMap` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationshipToStudent_new" AS ENUM ('FATHER', 'MOTHER');
ALTER TABLE "Parent" ALTER COLUMN "relationshipToStudent" TYPE "RelationshipToStudent_new" USING ("relationshipToStudent"::text::"RelationshipToStudent_new");
ALTER TYPE "RelationshipToStudent" RENAME TO "RelationshipToStudent_old";
ALTER TYPE "RelationshipToStudent_new" RENAME TO "RelationshipToStudent";
DROP TYPE "public"."RelationshipToStudent_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."StudentParentMap" DROP CONSTRAINT "StudentParentMap_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentParentMap" DROP CONSTRAINT "StudentParentMap_studentId_fkey";

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "parentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."StudentParentMap";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
