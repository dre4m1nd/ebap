export interface Student {
    id: number;
    nickName: string;
    email: string;
    status: number;
    dormId: number;
    createTime?: string;
    updateTime?: string;
}
export interface StudentForm {
    nickName: string;
    email: string;
    status: number;
    dormId: number;
}
