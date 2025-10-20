-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_class_id_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "class_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
