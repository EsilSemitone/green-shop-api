import 'reflect-metadata';
import { Container, ContainerModule } from 'inversify';
import { APP_TYPES } from './types';
import { App } from './app';
import { IMainReturnType } from './common/interfaces/main-return.interface';
import { ConfigService } from './core/configService/config.service';
import { LoggerService } from './core/logger/logger.service';
import { ILogger } from './core/logger/logger.service.interface';
import { IController } from './common/interfaces/controller.interface';
import { AuthController } from './auth/auth.controller';
import { IExceptionsFilter } from './common/exceptionFilter/exceptionFilter.interface';
import { ExceptionsFilter } from './common/exceptionFilter/exceptionFilter';
import { AuthService } from './auth/auth.service';
import { IAuthService } from './auth/interfaces/auth.service.interface';
import { IDatabaseService } from './core/database/database.service.interface';
import { DatabaseService } from './core/database/database.service';
import { IUserRepository } from './user/interfaces/user.repository.interface';
import { UserRepository } from './user/user.repository';
import { IJwtService } from './core/jwtService/jwt.service.interface';
import { JwtService } from './core/jwtService/jwt.service';
import { IEmailService } from './integration/email/email.service.interface';
import { EmailService } from './integration/email/email.service';
import { IRefreshTokenRepository } from './refresh-token/interfaces/refresh-token.repository.interface';
import { RefreshTokenRepository } from './refresh-token/refresh-token.repository';
import { AuthGuardFactory } from './common/middlewares/auth.guard.factory';
import { IProductService } from './product/interfaces/product.service.interface';
import { IProductRepository } from './product/interfaces/product.repository.interface';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductRepository } from './product/product.repository';
import { UserController } from './user/user.controller';
import { IUserService } from './user/interfaces/user.service.interface';
import { UserService } from './user/user.service';
import { IS3Service } from './integration/s3/interfaces/s3.service.interface';
import { S3Service } from './integration/s3/s3.service';
import { UploadController } from './upload/upload.controller';
import { CartController } from './cart/cart.controller';
import { ICartService } from './cart/interfaces/cart.service.interface';
import { CartService } from './cart/cart.service';
import { ICartRepository } from './cart/interfaces/cart.repository.interface';
import { cartRepository } from './cart/cart.repository';
import { AddressController } from './address/address.controller';
import { IAddressService } from './address/interfaces/address.service.interface';
import { AddressService } from './address/address.service';
import { IAddressRepository } from './address/interfaces/address.repository.interface';
import { AddressRepository } from './address/address.repository';
import { IOrderService } from './order/interfaces/order.service.interface';
import { IOrderRepository } from './order/interfaces/order.repository.interface';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderRepository } from './order/order.repository';
import { IPaymentMethodRepository } from './payment-method/interfaces/payment-method.repository.interface';
import { PaymentMethodRepository } from './payment-method/payment-method.repository';
import { PaymentMethodController } from './payment-method/payment-method.controller';
import { IPaymentMethodService } from './payment-method/interfaces/payment-method.service.interface';
import { PaymentMethodService } from './payment-method/payment-method.service';
import { IYookassaService } from './integration/yookassa/interfaces/yookassa.service.interface';
import { YookassaService } from './integration/yookassa/yookassa.service';
import { YookassaController } from './integration/yookassa/yookassa.controller';
import { FavoritesController } from './favorites/favorites.controller';
import { IFavoritesService } from './favorites/interfaces/favorites.service.interface';
import { FavoritesService } from './favorites/favorites.service';
import { IFavoritesRepository } from './favorites/interfaces/favorites.repository.interface';
import { FavoritesRepository } from './favorites/favorites.repository';
import { ReviewController } from './review/review.controller';
import { IReviewService } from './review/interfaces/review.service.interface';
import { ReviewService } from './review/review.service';
import { IReviewRepository } from './review/interfaces/review.repository.interface';
import { ReviewRepository } from './review/review.repository';
import { LikeController } from './like/like.controller';
import { ILikeService } from './like/interfaces/like.service.interface';
import { LikeService } from './like/like.service';
import { ILikeRepository } from './like/interfaces/like.repository';
import { likeRepository } from './like/like.repository';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { IConfigService } from './core/configService/config.service.interface';
import { TagController } from './tag/tag.controller';
import { ITagService } from './tag/interfaces/tag.service.interface';
import { TagService } from './tag/tag.service';
import { ITagRepository } from './tag/interfaces/tag.repository.interface';
import { tagRepository } from './tag/tag.repository';

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

const TagModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.TAG_CONTROLLER).to(TagController).inSingletonScope();
    bind<ITagService>(APP_TYPES.TAG_SERVICE).to(TagService).inSingletonScope();
    bind<ITagRepository>(APP_TYPES.TAG_REPOSITORY).to(tagRepository).inSingletonScope();
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
    container.load(TagModule);
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
