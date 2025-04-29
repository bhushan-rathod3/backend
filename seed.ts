import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Skill } from './src/skills/entities/skill.entity';
import { Project } from './src/projects/entities/project.entity';
import { UserRole } from './src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Bid } from 'src/bids/entities/bid.entity';
import { Milestone } from 'src/milestones/entities/milestone.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Message } from 'src/messages/entities/message.entity';
import { File } from 'src/files/entities/file.entity';
import { UserSkill } from 'src/skills/entities/user-skill.entity';

// Setup datasource manually
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'bhushan',
  database: process.env.DB_DATABASE || 'skillsync',
  entities: [
    User,
    Skill,
    Project,
    Bid,
    Milestone,
    Invoice,
    Message,
    File,
    UserSkill,
  ],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  console.log('Database connected for seeding...');

  const userRepo = AppDataSource.getRepository(User);
  const skillRepo = AppDataSource.getRepository(Skill);
  const projectRepo = AppDataSource.getRepository(Project);

  // --- 1. Create Mock Users ---
  // const passwordHash = await bcrypt.hash('password123', 10);

  const client = userRepo.create({
    name: 'Client One',
    email: 'client1@example.com',
    password: 'password123',
    role: UserRole.CLIENT,
    bio: 'I need awesome projects done!',
  });

  const freelancer = userRepo.create({
    name: 'Freelancer One',
    email: 'freelancer1@example.com',
    password: 'password123',
    role: UserRole.FREELANCER,
    bio: 'I build awesome projects!',
  });

  await userRepo.save([client, freelancer]);
  console.log('✅ Users seeded.');

  // --- 2. Create Mock Skills ---
  const skills = skillRepo.create([
    { name: 'NestJS' },
    { name: 'ReactJS' },
    { name: 'TypeScript' },
  ]);

  await skillRepo.save(skills);
  console.log('✅ Skills seeded.');

  // --- 3. Create Mock Project ---
  const project = projectRepo.create({
    title: 'Build a portfolio website',
    category: 'Web Development',
    description: 'I need a personal portfolio site made with ReactJS.',
    budget: 800,
    deadline: new Date('2025-06-15'),
    client: client,
    status: 'open',
  });

  await projectRepo.save(project);
  console.log('✅ Projects seeded.');

  await AppDataSource.destroy();
  console.log('✅ Database connection closed.');
  console.log('🎉 Seeding completed successfully.');
}

seed().catch((error) => {
  console.error('❌ Seeding failed', error);
  process.exit(1);
});
