import { Repository } from 'typeorm';
import { Guide } from './entities/guide.entity';
export declare class GuidesController {
    private guideRepository;
    constructor(guideRepository: Repository<Guide>);
    getAllGuides(): Promise<Guide[]>;
    getGuide(lang: string): Promise<Guide | {
        content: string;
    }>;
    updateGuide(body: {
        lang: string;
        content: string;
    }): Promise<Guide>;
}
