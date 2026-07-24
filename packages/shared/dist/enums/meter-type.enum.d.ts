export declare const MeterType: {
    readonly LIGHT: 1;
    readonly AIR: 2;
};
export type MeterType = (typeof MeterType)[keyof typeof MeterType];
