import { Repository } from 'typeorm';
import { Ad } from './entities/ad.entity';
export declare class AdsController {
    private adRepository;
    constructor(adRepository: Repository<Ad>);
    getActiveAds(): Promise<Ad[]>;
    getAllAds(): Promise<Ad[]>;
    createAd(body: Partial<Ad>): Promise<Ad>;
    updateAd(id: string, body: Partial<Ad>): Promise<Ad | null>;
    toggleAd(id: string): Promise<Ad | undefined>;
    deleteAd(id: string): Promise<{
        success: boolean;
    }>;
}
