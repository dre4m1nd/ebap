export interface Dorm {
    id: number;
    dormNo: string;
    openId: string;
    limitLight: number;
    limitAir: number;
    status: number;
    createTime?: string;
    updateTime?: string;
}
export interface DormForm {
    dormNo: string;
    openId: string;
    limitLight: number;
    limitAir: number;
    status: number;
}
export interface DormQuery {
    pageNum: number;
    pageSize: number;
    dormNo?: string;
    status?: number;
}
