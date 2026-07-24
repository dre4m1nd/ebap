export interface EmailLog {
    id: number;
    dormId: number;
    studentId: number;
    meterType?: number;
    status?: number;
    content?: string;
    sendTime: string;
}
export interface EmailLogForm {
    dormId: number;
    studentId: number;
    sendTime?: string;
}
export interface EmailLogQuery {
    pageNum: number;
    pageSize: number;
    dormId?: number;
    studentId?: number;
    startTime?: string;
    endTime?: string;
}
