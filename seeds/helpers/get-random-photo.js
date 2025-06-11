"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPhotos = getRandomPhotos;
function getRandomPhotos(photos, count) {
    var res = [];
    for (var i = 0; i < count; i++) {
        res.push(photos[Math.floor(Math.random() * photos.length)]);
    }
    return res;
}
