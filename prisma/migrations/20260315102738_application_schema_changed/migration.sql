-- DropIndex
DROP INDEX "applications_jobId_key";

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "parsed_resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
