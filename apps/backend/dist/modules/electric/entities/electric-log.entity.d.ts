import { Dorm } from '../../dorm/entities/dorm.entity';
export declare class ElectricLog {
    id: number;
    dormId: number;
    dorm: Dorm;
    meterType: number;
    leftMoney: number;
    leftEle: number;
    queryTime: Date;
}
