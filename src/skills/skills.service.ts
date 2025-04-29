import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async create(name: string): Promise<Skill> {
    const skill = this.skillsRepository.create({ name });
    return this.skillsRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillsRepository.find();
  }
}
