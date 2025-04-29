import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async create(data: Partial<Invoice>): Promise<Invoice> {
    const invoice = this.invoiceRepository.create(data);
    return this.invoiceRepository.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find();
  }
}
