"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductVariants = getProductVariants;
var contracts_green_shop_1 = require("contracts-green-shop");
var crypto_1 = require("crypto");
function getProductVariants(products) {
    var sizes = [contracts_green_shop_1.SIZE.LARGE, contracts_green_shop_1.SIZE.MEDIUM, contracts_green_shop_1.SIZE.SMALL];
    var result = products
        .map(function (product) {
        var variantAmount = Math.floor(Math.random() * 3);
        var res = [];
        for (var i = 0; i <= variantAmount; i++) {
            res.push({
                uuid: (0, crypto_1.randomUUID)(),
                product_id: product.uuid,
                rating: Number.parseFloat("".concat(Math.floor(Math.random() * 4) + 1, ".").concat(Math.floor(Math.random() * 99))),
                price: Number.parseFloat("".concat(Math.floor(Math.random() * 1000) + 50, ".").concat(Math.floor(Math.random() * 99))),
                size: sizes[i],
                stock: Math.floor(Math.random() * 100) + 1,
                created_at: product.created_at,
                updated_at: product.created_at,
            });
        }
        return res;
    })
        .flat(1);
    return result;
}
