import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { sign, verify as jwtVerify } from 'jsonwebtoken';
import { APP_TYPES } from '../../types';
import { IConfigService } from '../configService/config.service.interface';
import { ROLES } from 'contracts';
import { IJwtPayload } from './interfaces/jwt.payload';
import { IJwtService } from './jwt.service.interface';

@injectable()
export class JwtService implements IJwtService {
    secret: string;

    constructor(@inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService) {
        this.secret = this.configService.getOrThrow('SECRET');
    }

    async signAccess(userId: string, role: ROLES): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    role,
                    userId,
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                },
                this.secret,
                { algorithm: 'HS256' },
                (error, encoded) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(encoded as string);
                },
            );
        });
    }

    async signRefresh(userId: string, role: ROLES): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    role,
                    userId,
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                },
                this.secret,
                { algorithm: 'HS256' },
                (error, encoded) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(encoded as string);
                },
            );
        });
    }

    verify(token: string): Promise<IJwtPayload> {
        return new Promise<IJwtPayload>((resolve, reject) => {
            jwtVerify(token, this.secret, (error, decoder) => {
                if (error) {
                    reject(error);
                }
                resolve(decoder as IJwtPayload);
            });
        });
    }
}
