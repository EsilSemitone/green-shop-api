"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductVariantTags = getProductVariantTags;
var crypto_1 = require("crypto");
function getProductVariantTags(tags, product_variant_uuids) {
    var resArr = [];
    product_variant_uuids.forEach(function (uuid) {
        var amountTags = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < amountTags; i++) {
            var date = new Date();
            var result = {
                uuid: (0, crypto_1.randomUUID)(),
                tag_id: tags[Math.floor(Math.random() * tags.length)].uuid,
                product_variant_id: uuid,
                created_at: date,
                updated_at: date,
            };
            resArr.push(result);
        }
    });
    return resArr;
}
