import { PRODUCT_CATEGORY } from 'contracts';

export interface IUpdateProduct {
    uuid: string;
    data: {
        name?: string;
        short_description?: string;
        description?: string;
        category?: PRODUCT_CATEGORY;
        images?: string[];
    };
}
