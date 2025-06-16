import 'reflect-metadata';

import { IJwtService } from '../../core/jwtService/jwt.service.interface.ts';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../../types';
import { AuthGuard } from './auth.guard';

@injectable()
export class AuthGuardFactory {
    constructor(@inject(APP_TYPES.JWT_SERVICE) private jwtService: IJwtService) {}

    create(): AuthGuard {
        return new AuthGuard(this.jwtService);
    }
}
