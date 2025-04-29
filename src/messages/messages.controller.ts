import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('project/:projectId')
  send(
    @Param('projectId') projectId: number,
    @Body() createMessageDto: CreateMessageDto,
    @Req() req,
  ) {
    const senderId = req.user.id;
    return this.messagesService.send(createMessageDto, projectId, senderId);
  }

  @Get('project/:projectId')
  getMessages(@Param('projectId') projectId: number, @Req() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.messagesService.getMessages(projectId, userId, userRole);
  }
}
