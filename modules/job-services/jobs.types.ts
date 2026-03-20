import { EmploymentType } from "../../generated/prisma/enums";

export interface JobTypes {
    recruiterId: string;
    title: string;
    description: string;
    requirements: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    employmentType: EmploymentType;
    atsKeywords: string[];
    atsMinScore: number;
    atsWeights: {
        skills: number;
        experience: number;
        education: number;
    };
}