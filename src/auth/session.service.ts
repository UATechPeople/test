import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './session.schema';
import { CreateSessionDto } from './dto/create-session.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private sessionDocumentModel: Model<SessionDocument>,
  ) {}

  async createSession(
    createSessionDto: CreateSessionDto,
  ): Promise<SessionDocument> {
    const newSession = new this.sessionDocumentModel({
      sessionID: uuid(),
      user: createSessionDto.user,
    });

    return newSession.save();
  }

  async getSession(sessionId: string): Promise<SessionDocument> {
    const session = await this.sessionDocumentModel.findOne({
      sessionID: sessionId,
    });
    return session;
  }

  async deleteSessionsByUser(user): Promise<boolean> {
    await this.sessionDocumentModel.deleteMany({ user: user._id });
    return true;
  }
}
