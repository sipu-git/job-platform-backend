import { extractText } from "../configs/extractText"
import { prisma } from "../../../lib/prisma"
import { parsedResumeWithAi } from "./genAi.service"
import { uploadResumeToS3 } from "./s3.service"

export const processResume = async (userId: string, file: Express.Multer.File) => {
    const fileUrl = await uploadResumeToS3(file)
    const rawText = await extractText(file.buffer, file.originalname)

    const rawParsedData = await parsedResumeWithAi(rawText)

    const savedData = await prisma.parsedResume.create({
        data: {
            userId, fileUrl, rawText,
            fullName: rawParsedData.fullName,
            email: rawParsedData.email,
            phone: rawParsedData.phone,
            summary: rawParsedData.summary,
            skills: rawParsedData.skills as any,
            experience: rawParsedData.experience as any,
            education: rawParsedData.education as any,
            certifications: rawParsedData.certifications as any,
            languages: rawParsedData.languages as any,
        }
    })
    return savedData;
}

export const viewResumes =async (userId:string)=>{
    return prisma.parsedResume.findMany({
        where:{userId},
        orderBy:{parsedAt:"asc"}
    })
}