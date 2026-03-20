import { JobStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { getIO } from "../../shared/web-socket/socket";
import { JobTypes } from "./jobs.types";

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
  const io = getIO()
  io.emit("job-posted", job)
  return job;
};

export const viewJobs = async () => {
  const jobs = await prisma.jobs.findMany({
    where: {
      status: JobStatus.OPEN
    },
    orderBy: {
      createdAt: "asc"
    },
    include: {
      recruiter: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  })
  return jobs;
}

export const viewJob = async (jobId: string) => {
  const findJob = await prisma.jobs.findUnique({
    where: { id: jobId }
  })
  if (!findJob) {
    throw new Error("job doesn't exist!")
  }
  return findJob;
}

export const searchJob = async (query: {
  keyword?: string;
  location?: string;
  employmentType?: string;
  minSalary?: number;
  maxSalary?: number;
  page?: number;
  limit?: number;
}) => {
  const { keyword, location, employmentType, minSalary, maxSalary, page = 1, limit = 10 } = query;

  const skip = (page - 1) * limit;
  const searchJobs = await prisma.jobs.findMany({
    where: {
      status: "OPEN", ...(keyword && {
        OR: [{ title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { requirements: { contains: keyword, mode: "insensitive" } }
        ]
      }),
      ...(location && { location: { contains: location, mode: "insensitive" } }),
      ...(minSalary && { salaryMin: { gte: Number(minSalary) } }),
      ...(employmentType && { employmentType: employmentType as any }),
      ...(maxSalary && { salaryMax: { lte: Number(maxSalary) } }),
    },
    include: {
      recruiter: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }, skip,
    take: limit
  })
  const total = await prisma.jobs.count({
    where: {
      status: "OPEN"
    }
  })
  return {
    total,
    page,
    limit,
    searchJobs
  }
}