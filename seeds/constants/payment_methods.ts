import { PAYMENT_METHOD } from 'contracts-green-shop';

export const PAYMENT_METHODS = [
    {
        uuid: '387a6014-05f0-4382-a6cb-2e5f4c46dd29',
        name: PAYMENT_METHOD.CASH,
        description: 'Оплата наличными при получении',
        price: 199,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        uuid: '387a6014-05f0-4382-a5cb-2e5f4c46dd29',
        name: PAYMENT_METHOD.YOOKASSA,
        description: 'Оплата ЮКасса',
        price: 199,
        created_at: new Date(),
        updated_at: new Date(),
    },
];
