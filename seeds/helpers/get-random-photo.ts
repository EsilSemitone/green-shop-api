export function getRandomPhotos(photos: string[], count: number) {
    const res = [];
    for (let i = 0; i < count; i++) {
        res.push(photos[Math.floor(Math.random() * photos.length)]);
    }
    return res;
}
