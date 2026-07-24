import type { TimeRange } from '../enums/time-range.enum';
export interface ElectricLog {
    id: number;
    dormId: number;
    meterType: number;
    leftMoney: number;
    leftEle: number;
    queryTime: string;
}
export interface ElectricLogQuery {
    dormId: number;
    type: number;
    pageNum: number;
    pageSize: number;
    startTime?: string;
    endTime?: string;
}
export interface ElectricChartItem {
    leftElectric: string;
    leftMoney: string;
    time: string;
}
export interface ElectricChartQuery {
    dormId: number;
    type: number;
    timeRange: TimeRange;
}
