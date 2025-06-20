import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/abstract.controller';
import { IController } from '../../common/interfaces/controller.interface';
import { Request, Response } from 'express';
import { YookassaPaymentWebhookRequestDto } from './dto/payment.dto';
import { APP_TYPES } from '../../types';
import { IYookassaService } from './interfaces/yookassa.service.interface';

@injectable()
export class YookassaController extends Controller implements IController {
    constructor(@inject(APP_TYPES.YOOKASSA_SERVICE) private yookassaService: IYookassaService) {
        super();

        this.bindRouts([
            {
                path: '/payment',
                method: 'post',
                func: this.payment,
            },
        ]);
    }

    async payment({ body }: Request<object, object, YookassaPaymentWebhookRequestDto>, res: Response) {
        await this.yookassaService.handlePayment(body);
        res.sendStatus(200);
    }
}
