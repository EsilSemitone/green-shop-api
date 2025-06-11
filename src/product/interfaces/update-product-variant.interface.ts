import { SIZE } from 'contracts-green-shop';

export interface IUpdateProductVariant {
    uuid: string;
    rating?: number;
    price?: number;
    size?: SIZE;
    stock?: number;
}
