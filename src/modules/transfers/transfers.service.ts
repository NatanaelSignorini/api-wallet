import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);

  constructor() {}
}
