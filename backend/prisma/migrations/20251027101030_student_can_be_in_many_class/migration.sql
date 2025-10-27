-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_class_id_fkey";

-- CreateTable
CREATE TABLE "StudentClassMap" (
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "StudentClassMap_pkey" PRIMARY KEY ("studentId","classId")
);

-- AddForeignKey
ALTER TABLE "StudentClassMap" ADD CONSTRAINT "StudentClassMap_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClassMap" ADD CONSTRAINT "StudentClassMap_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
