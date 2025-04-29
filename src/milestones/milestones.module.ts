import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { Milestone } from './entities/milestone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Milestone])],
  controllers: [MilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule {}
