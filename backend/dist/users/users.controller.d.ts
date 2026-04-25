import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersController {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(body: {
        locksyId: string;
        region?: string;
    }): Promise<User>;
    getAllUsers(): Promise<User[]>;
}
