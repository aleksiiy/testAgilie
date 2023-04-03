import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CryptoService {
  constructor(private prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.crypto.findMany();
  }

	async findByShortName(shortName: string) {
		return await this.prismaService.crypto.findFirst({ where: { shortName: shortName } });
	}
}
