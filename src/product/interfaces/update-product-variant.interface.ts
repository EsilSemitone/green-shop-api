import { SIZE } from 'contracts';

export interface IUpdateProductVariant {
    uuid: string;
    rating?: number;
    price?: number;
    size?: SIZE;
    stock?: number;
}
