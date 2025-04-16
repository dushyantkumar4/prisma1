import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient({
    let:["query"],
});

export default prisma;