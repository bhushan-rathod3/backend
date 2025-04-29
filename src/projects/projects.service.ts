import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UsersService } from 'src/users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly usersService: UsersService,
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
    clientId: number,
  ): Promise<Project> {
    const client = await this.usersService.findById(clientId);
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const project = this.projectRepository.create(createProjectDto);
    project.client = client;
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['client'] });
  }

  async findById(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'assignedFreelancer'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }
}
