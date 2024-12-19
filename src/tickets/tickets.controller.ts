import { Controller } from '@nestjs/common';
import { TicketService } from './tickets.service';

@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}
}
