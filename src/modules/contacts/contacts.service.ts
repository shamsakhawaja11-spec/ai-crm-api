import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateContactDto } from "./dto/create-contact.dto";
import { PrismaService } from "@/database/prisma.service";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { ContactFilterDto } from "./dto/contact-filter.dto";
import { Prisma } from '@prisma/client';
@Injectable()
export class ContactsService{
    constructor(private prisma:PrismaService){}
    async create(teamId:string,dto:CreateContactDto){
        const contact=await this.prisma.contact.create({data:{
            teamId,
            ...dto
        }});
        return contact;
    }
    async update(id:string,dto:UpdateContactDto,teamId:string){
        const contact=await this.prisma.contact.updateMany({where:{id:id,teamId},data:dto});
        return contact;
    }
    async findAll(teamId: string, filter: ContactFilterDto) {
        const { search, companyId, city, country, tags, page = 1, limit = 20 } = filter;

        const where = {
            teamId,
            ...(search && {
            OR: [
                { firstName: { contains: search, mode: Prisma.QueryMode.insensitive} },
                { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
            }),
            ...(companyId && { companyId }),
            ...(city && { city }),
            ...(country && { country }),
            ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
        };

        const [contacts, total] = await Promise.all([
            this.prisma.contact.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            }),
            this.prisma.contact.count({ where }),
        ]);

        return {
            data: contacts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(teamId:string,id:string){
        const contact=await this.prisma.contact.findFirst({where:{teamId,id}});
        if(!contact){
            throw new NotFoundException('Contact not found');
        }
        return contact;
    }   
    async delete(teamId:string,id:string){
        await this.prisma.contact.deleteMany({where:{teamId,id}});
    }
}