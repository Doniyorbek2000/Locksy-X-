import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
export declare class NotificationsController {
    private notifRepository;
    constructor(notifRepository: Repository<Notification>);
    getAll(): Promise<Notification[]>;
    create(body: {
        title: string;
        message: string;
    }): Promise<Notification>;
    update(id: string, body: {
        title?: string;
        message?: string;
    }): Promise<Notification | null>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
