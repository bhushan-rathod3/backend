import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async upload(
    file: Express.Multer.File,
    projectId: number,
    uploaderId: number,
  ): Promise<File> {
    const newFile = this.fileRepository.create({
      fileUrl: file.filename,
      fileType: file.mimetype,
      project: { id: projectId },
      uploader: { id: uploaderId },
    });
    return this.fileRepository.save(newFile);
  }

  async findByProject(projectId: number): Promise<File[]> {
    return this.fileRepository.find({ where: { project: { id: projectId } } });
  }
}
