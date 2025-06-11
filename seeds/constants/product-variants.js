"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_VARIANTS = void 0;
var get_product_variants_ts_1 = require("../helpers/get-product-variants.ts");
var products_ts_1 = require("./products.ts");
exports.PRODUCT_VARIANTS = (0, get_product_variants_ts_1.getProductVariants)(products_ts_1.PRODUCTS);
