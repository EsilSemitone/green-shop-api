export interface IS3Service {
    uploadFile(path: string, file: Express.Multer.File): Promise<string>;
}
