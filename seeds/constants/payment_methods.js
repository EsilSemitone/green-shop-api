"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_METHODS = void 0;
var contracts_green_shop_1 = require("contracts-green-shop");
exports.PAYMENT_METHODS = [
    {
        uuid: '387a6014-05f0-4382-a6cb-2e5f4c46dd29',
        name: contracts_green_shop_1.PAYMENT_METHOD.CASH,
        description: 'Оплата наличными при получении',
        price: 199,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        uuid: '387a6014-05f0-4382-a5cb-2e5f4c46dd29',
        name: contracts_green_shop_1.PAYMENT_METHOD.YOOKASSA,
        description: 'Оплата ЮКасса',
        price: 199,
        created_at: new Date(),
        updated_at: new Date(),
    },
];
