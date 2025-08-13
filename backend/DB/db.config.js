const { PrismaClient } = require('../generated/prisma');
const prisma=new PrismaClient({
    log:["query"],
})
module.exports=prisma