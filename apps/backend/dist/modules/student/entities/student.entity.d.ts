import { Dorm } from '../../dorm/entities/dorm.entity';
export declare class Student {
    id: number;
    dormId: number;
    dorm: Dorm;
    nickName: string;
    email: string;
    status: number;
    createTime: Date;
    updateTime: Date;
}
