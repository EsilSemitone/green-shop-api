import 'reflect-metadata';
import { Container, ContainerModule } from 'inversify';
import { APP_TYPES } from './types.ts';
import { App } from './app.ts';
import { IMainReturnType } from './common/interfaces/main-return.interface.ts';
import { ConfigService } from './core/configService/config.service.ts';
import { LoggerService } from './core/logger/logger.service.ts';
import { ILogger } from './core/logger/logger.service.interface.ts';
import { IController } from './common/interfaces/controller.interface.ts';
import { AuthController } from './auth/auth.controller.ts';
import { IExceptionsFilter } from './common/exceptionFilter/exceptionFilter.interface.ts';
import { ExceptionsFilter } from './common/exceptionFilter/exceptionFilter.ts';
import { AuthService } from './auth/auth.service.ts';
import { IAuthService } from './auth/interfaces/auth.service.interface.ts';
import { IDatabaseService } from './core/database/database.service.interface.ts';
import { DatabaseService } from './core/database/database.service.ts';
import { IUserRepository } from './user/interfaces/user.repository.interface.ts';
import { UserRepository } from './user/user.repository.ts';
import { IJwtService } from './core/jwtService/jwt.service.interface.ts';
import { JwtService } from './core/jwtService/jwt.service.ts';
import { IEmailService } from './integration/email/email.service.interface.ts';
import { EmailService } from './integration/email/email.service.ts';
import { IRefreshTokenRepository } from './refresh-token/interfaces/refresh-token.repository.interface.ts';
import { RefreshTokenRepository } from './refresh-token/refresh-token.repository.ts';
import { AuthGuardFactory } from './common/middlewares/auth.guard.factory.ts';
import { IProductService } from './product/interfaces/product.service.interface.ts';
import { IProductRepository } from './product/interfaces/product.repository.interface.ts';
import { ProductController } from './product/product.controller.ts';
import { ProductService } from './product/product.service.ts';
import { ProductRepository } from './product/product.repository.ts';
import { UserController } from './user/user.controller.ts';
import { IUserService } from './user/interfaces/user.service.interface.ts';
import { UserService } from './user/user.service.ts';
import { IS3Service } from './integration/s3/interfaces/s3.service.interface.ts';
import { S3Service } from './integration/s3/s3.service.ts';
import { UploadController } from './upload/upload.controller.ts';
import { CartController } from './cart/cart.controller.ts';
import { ICartService } from './cart/interfaces/cart.service.interface.ts';
import { CartService } from './cart/cart.service.ts';
import { ICartRepository } from './cart/interfaces/cart.repository.interface.ts';
import { cartRepository } from './cart/cart.repository.ts';
import { AddressController } from './address/address.controller.ts';
import { IAddressService } from './address/interfaces/address.service.interface.ts';
import { AddressService } from './address/address.service.ts';
import { IAddressRepository } from './address/interfaces/address.repository.interface.ts';
import { AddressRepository } from './address/address.repository.ts';
import { IOrderService } from './order/interfaces/order.service.interface.ts';
import { IOrderRepository } from './order/interfaces/order.repository.interface.ts';
import { OrderController } from './order/order.controller.ts';
import { OrderService } from './order/order.service.ts';
import { OrderRepository } from './order/order.repository.ts';
import { IPaymentMethodRepository } from './payment-method/interfaces/payment-method.repository.interface.ts';
import { PaymentMethodRepository } from './payment-method/payment-method.repository.ts';
import { PaymentMethodController } from './payment-method/payment-method.controller.ts';
import { IPaymentMethodService } from './payment-method/interfaces/payment-method.service.interface.ts';
import { PaymentMethodService } from './payment-method/payment-method.service.ts';
import { IYookassaService } from './integration/yookassa/interfaces/yookassa.service.interface.ts';
import { YookassaService } from './integration/yookassa/yookassa.service.ts';
import { YookassaController } from './integration/yookassa/yookassa.controller.ts';
import { FavoritesController } from './favorites/favorites.controller.ts';
import { IFavoritesService } from './favorites/interfaces/favorites.service.interface.ts';
import { FavoritesService } from './favorites/favorites.service.ts';
import { IFavoritesRepository } from './favorites/interfaces/favorites.repository.interface.ts';
import { FavoritesRepository } from './favorites/favorites.repository.ts';
import { ReviewController } from './review/review.controller.ts';
import { IReviewService } from './review/interfaces/review.service.interface.ts';
import { ReviewService } from './review/review.service.ts';
import { IReviewRepository } from './review/interfaces/review.repository.interface.ts';
import { ReviewRepository } from './review/review.repository.ts';
import { LikeController } from './like/like.controller.ts';
import { ILikeService } from './like/interfaces/like.service.interface.ts';
import { LikeService } from './like/like.service.ts';
import { ILikeRepository } from './like/interfaces/like.repository.ts';
import { likeRepository } from './like/like.repository.ts';
import { AuthMiddleware } from './common/middlewares/auth.middleware.ts';
import { IConfigService } from './core/configService/config.service.interface.ts';

const container = new Container();

const appModule = new ContainerModule(({ bind }) => {
    bind<IConfigService>(APP_TYPES.CONFIG_SERVICE).to(ConfigService).inSingletonScope();
    bind<ILogger>(APP_TYPES.LOGGER_SERVICE).to(LoggerService);
    bind<IExceptionsFilter>(APP_TYPES.EXCEPTION_FILTER).to(ExceptionsFilter).inSingletonScope();
    bind<IDatabaseService>(APP_TYPES.DATABASE_SERVICE).to(DatabaseService).inSingletonScope();
    bind<IJwtService>(APP_TYPES.JWT_SERVICE).to(JwtService).inSingletonScope();
    bind<AuthGuardFactory>(APP_TYPES.AUTH_GUARD_FACTORY).to(AuthGuardFactory).inSingletonScope();
    bind<AuthMiddleware>(APP_TYPES.AUTH_MIDDLEWARE).to(AuthMiddleware).inSingletonScope();

    bind<IRefreshTokenRepository>(APP_TYPES.REFRESH_TOKEN_REPOSITORY).to(RefreshTokenRepository).inSingletonScope();
    bind<IController>(APP_TYPES.UPLOAD_CONTROLLER).to(UploadController).inSingletonScope();
});

const integrationModule = new ContainerModule(({ bind }) => {
    bind<IEmailService>(APP_TYPES.EMAIL_SERVICE).to(EmailService).inSingletonScope();
    bind<IS3Service>(APP_TYPES.S3_SERVICE).to(S3Service).inSingletonScope();
});

const authModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.AUTH_CONTROLLER).to(AuthController).inSingletonScope();
    bind<IAuthService>(APP_TYPES.AUTH_SERVICE).to(AuthService).inSingletonScope();
});

const userModule = new ContainerModule(({ bind }) => {
    bind<IUserRepository>(APP_TYPES.USER_REPOSITORY).to(UserRepository).inSingletonScope();
    bind<IController>(APP_TYPES.USER_CONTROLLER).to(UserController).inSingletonScope();
    bind<IUserService>(APP_TYPES.USER_SERVICE).to(UserService).inSingletonScope();
});

const productModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.PRODUCT_CONTROLLER).to(ProductController).inSingletonScope();
    bind<IProductService>(APP_TYPES.PRODUCT_SERVICE).to(ProductService).inSingletonScope();
    bind<IProductRepository>(APP_TYPES.PRODUCT_REPOSITORY).to(ProductRepository).inSingletonScope();
});

const cartModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.CART_CONTROLLER).to(CartController).inSingletonScope();
    bind<ICartService>(APP_TYPES.CART_SERVICE).to(CartService).inSingletonScope();
    bind<ICartRepository>(APP_TYPES.CART_REPOSITORY).to(cartRepository).inSingletonScope();
});

const addressModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.ADDRESS_CONTROLLER).to(AddressController).inSingletonScope();
    bind<IAddressService>(APP_TYPES.ADDRESS_SERVICE).to(AddressService).inSingletonScope();
    bind<IAddressRepository>(APP_TYPES.ADDRESS_REPOSITORY).to(AddressRepository).inSingletonScope();
});

const orderModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.ORDER_CONTROLLER).to(OrderController).inSingletonScope();
    bind<IOrderService>(APP_TYPES.ORDER_SERVICE).to(OrderService).inSingletonScope();
    bind<IOrderRepository>(APP_TYPES.ORDER_REPOSITORY).to(OrderRepository).inSingletonScope();
});

const PaymentMethodModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.PAYMENT_METHOD_CONTROLLER).to(PaymentMethodController).inSingletonScope();
    bind<IPaymentMethodService>(APP_TYPES.PAYMENT_METHOD_SERVICE).to(PaymentMethodService).inSingletonScope();
    bind<IPaymentMethodRepository>(APP_TYPES.PAYMENT_METHOD_REPOSITORY).to(PaymentMethodRepository).inSingletonScope();
});

const YookassaModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.YOOKASSA_CONTROLLER).to(YookassaController).inSingletonScope();
    bind<IYookassaService>(APP_TYPES.YOOKASSA_SERVICE).to(YookassaService).inSingletonScope();
});

const FavoritesModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.FAVORITES_CONTROLLER).to(FavoritesController).inSingletonScope();
    bind<IFavoritesService>(APP_TYPES.FAVORITES_SERVICE).to(FavoritesService).inSingletonScope();
    bind<IFavoritesRepository>(APP_TYPES.FAVORITES_REPOSITORY).to(FavoritesRepository).inSingletonScope();
});

const ReviewModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.REVIEW_CONTROLLER).to(ReviewController).inSingletonScope();
    bind<IReviewService>(APP_TYPES.REVIEW_SERVICE).to(ReviewService).inSingletonScope();
    bind<IReviewRepository>(APP_TYPES.REVIEW_REPOSITORY).to(ReviewRepository).inSingletonScope();
});

const LikeModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.LIKE_CONTROLLER).to(LikeController).inSingletonScope();
    bind<ILikeService>(APP_TYPES.LIKE_SERVICE).to(LikeService).inSingletonScope();
    bind<ILikeRepository>(APP_TYPES.LIKE_REPOSITORY).to(likeRepository).inSingletonScope();
});

function buildContainer(): Container {
    container.load(appModule);
    container.load(userModule);
    container.load(authModule);
    container.load(productModule);
    container.load(integrationModule);
    container.load(cartModule);
    container.load(addressModule);
    container.load(orderModule);
    container.load(PaymentMethodModule);
    container.load(YookassaModule);
    container.load(FavoritesModule);
    container.load(ReviewModule);
    container.load(LikeModule);
    container.bind<App>(APP_TYPES.APP).to(App).inSingletonScope();

    return container;
}

async function main(): Promise<IMainReturnType> {
    const container = buildContainer();
    const app = container.get<App>(APP_TYPES.APP);
    app.init();

    return { app, container };
}

export const startApp = main();
