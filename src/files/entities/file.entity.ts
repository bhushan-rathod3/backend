import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.files)
  uploader: User;

  @ManyToOne(() => Project, (project) => project.files)
  project: Project;

  @Column()
  fileUrl: string;

  @Column()
  fileType: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
