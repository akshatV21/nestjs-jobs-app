import { Controller } from "@nestjs/common";
import { MessagesService } from "./messages.service";

@Controller()
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}
}