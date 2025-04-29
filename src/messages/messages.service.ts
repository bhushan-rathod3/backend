import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Project } from 'src/projects/entities/project.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async send(
    data: CreateMessageDto,
    projectId: number,
    senderId: number,
  ): Promise<Message> {
    // Validate that the project exists
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedFreelancer'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Determine the receiver
    let receiver;
    if (senderId === project.client.id) {
      // Client messaging the assigned freelancer
      if (!project.assignedFreelancer) {
        throw new NotFoundException(
          `No freelancer assigned to project ID ${projectId}`,
        );
      }
      receiver = { id: project.assignedFreelancer.id };
    } else if (senderId !== project.client.id) {
      // Freelancer messaging the client
      receiver = { id: project.client.id };
    } else {
      throw new NotFoundException('Sender is not associated with this project');
    }

    // Create and save the message
    const message = this.messageRepository.create({
      message: data.message,
      project: { id: projectId },
      sender: { id: senderId },
      receiver,
      attachmentUrl: data.attachmentUrl,
    });

    return this.messageRepository.save(message);
  }

  async getMessages(
    projectId: number,
    userId: number,
    userRole: string,
  ): Promise<Message[]> {
    // Validate that the project exists
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check access based on user role
    if (userRole === 'freelancer') {
      // Ensure the freelancer is associated with the project
      const messages = await this.messageRepository.find({
        where: { project: { id: projectId }, sender: { id: userId } },
        relations: ['sender', 'project'],
      });
      return messages;
    } else if (userRole === 'client') {
      // Ensure the client owns the project
      if (project.client.id !== userId) {
        throw new NotFoundException('You do not have access to this project');
      }
      const messages = await this.messageRepository.find({
        where: { project: { id: projectId } },
        relations: ['sender', 'project'],
      });
      return messages;
    } else {
      throw new NotFoundException('You do not have access to this project');
    }
  }
}
