import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { Project } from '../projects/entities/project.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>, // Inject the Project repository
  ) {}

  async create(
    data: CreateBidDto,
    projectId: number,
    freelancerId: number,
  ): Promise<Bid> {
    // Validate that the project exists
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Create and save the bid
    const bid = this.bidRepository.create({
      bidAmount: data.bidAmount,
      durationDays: data.durationDays,
      bidMessage: data.bidMessage,
      project: { id: projectId },
      freelancer: { id: freelancerId },
    });

    return this.bidRepository.save(bid);
  }

  async update(
    bidId: number,
    data: UpdateBidDto,
    freelancerId: number,
  ): Promise<Bid> {
    // Find the bid
    const bid = await this.bidRepository.findOne({
      where: { id: bidId },
      relations: ['freelancer'],
    });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${bidId} not found`);
    }

    // Ensure the freelancer owns the bid
    if (bid.freelancer.id !== freelancerId) {
      throw new ForbiddenException('You are not authorized to update this bid');
    }

    // Update the bid
    Object.assign(bid, data);
    return this.bidRepository.save(bid);
  }

  async findByProject(projectId: number): Promise<Bid[]> {
    // Check if the project exists
    const projectExists = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!projectExists) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Fetch bids for the project
    const bids = await this.bidRepository.find({
      where: { project: { id: projectId } },
      relations: ['freelancer'],
    });

    // Return the bids (empty array if no bids exist)
    return bids;
  }
}
