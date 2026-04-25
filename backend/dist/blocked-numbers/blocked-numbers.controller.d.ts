import { Repository } from 'typeorm';
import { BlockedNumber } from './entities/blocked-number.entity';
export declare class BlockedNumbersController {
    private blockedNumberRepository;
    constructor(blockedNumberRepository: Repository<BlockedNumber>);
    getAllGlobal(): Promise<BlockedNumber[]>;
    getUserBlocked(locksyId: string): Promise<BlockedNumber[]>;
    create(body: {
        number: string;
        userId?: string;
    }): Promise<BlockedNumber>;
    update(id: string, body: Partial<BlockedNumber>): Promise<BlockedNumber | null>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
