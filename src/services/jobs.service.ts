import { JobStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { JobTypes } from "../types/jobs/model.types";

export const addJob = async (recruiterId: string,
  data: Omit<JobTypes, "recruiterId">) => {
  if (data.salaryMin > data.salaryMax) {
    throw new Error("Minimum salary cannot be greater than maximum salary");
  }

  const job = await prisma.jobs.create({
    data: {
      recruiterId,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      location: data.location,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      employmentType: data.employmentType,
      status: JobStatus.OPEN,
      atsKeywords: data.atsKeywords,
      atsMinScore: data.atsMinScore,
      atsWeights: data.atsWeights,
    },
  });

  return job;
};