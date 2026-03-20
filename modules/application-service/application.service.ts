import { prisma } from "../../lib/prisma";

export async function applyJob(candidateId: string, jobId: string, resumeId: string) {
    const application = await prisma.application.create({
        data: {
            jobId, candidateId, resumeId, status: "APPLIED"
        }
    })
    return application;
}

export async function viewApplications(candidateId: string) {
    const viewApplications = await prisma.application.findMany({
        where: {
            candidateId
        },
        include: {
            job: {
                select: {
                    id: true,
                    title: true,
                    location: true,
                    employmentType: true,
                    salaryMin: true,
                    salaryMax: true,
                    createdAt: true
                }
            },
            resume: {
                select: {
                    id: true,
                    fullName: true,
                    skills: true
                }
            },
        
        },
        orderBy: {
            appliedAt: "desc"
        },
        take: 10
    })
    return viewApplications;
}

export async function deleteApplcation(candidateId: string, jobId: string) {
    const fetchApplication = await prisma.application.findFirst({
        where: { jobId,candidateId }
    })
    if (!fetchApplication) {
        throw new Error("application doesn't exist!")
    }
    const result = await prisma.application.delete({
       where:{
        id:fetchApplication.id
       }
    })
    return result;
}