import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(teamId: string, userId: string, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: { ...dto, teamId, userId },
    });
  }

  async findAll(teamId: string, contactId?: string, leadId?: string, dealId?: string) {
    const where: Prisma.NoteWhereInput = {
      teamId,
      ...(contactId && { contactId }),
      ...(leadId && { leadId }),
      ...(dealId && { dealId }),
    };

    return this.prisma.note.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async findOne(teamId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, teamId },
      include: { user: true },
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async remove(teamId: string, id: string) {
    await this.findOne(teamId, id);
    await this.prisma.note.deleteMany({ where: { id, teamId } });
  }
}