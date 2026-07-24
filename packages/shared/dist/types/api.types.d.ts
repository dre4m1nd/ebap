export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}
export interface PageResponse<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
}
export interface SelectOption {
    label: string;
    value: number;
}
