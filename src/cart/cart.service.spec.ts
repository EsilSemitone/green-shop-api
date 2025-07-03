import { Container } from 'inversify';
import { ILogger } from '../core/logger/logger.service.interface';
import { ICartService } from './interfaces/cart.service.interface';
import { ICartRepository } from './interfaces/cart.repository.interface';
import { IProductRepository } from '../product/interfaces/product.repository.interface';
import { APP_TYPES } from '../types';
import { CartService } from './cart.service';
import { CartItemModel, CartModel, ProductVariantModel } from '../common/models';
import { randomUUID } from 'crypto';
import { ERROR } from '../common/error/error';
import { SIZE } from 'contracts-green-shop';

let cartService: ICartService;

const loggerServiceMock: jest.Mocked<ILogger> = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setServiceName: jest.fn(),
};

const cartRepositoryMock: jest.Mocked<ICartRepository> = {
    getCartByUniqueCriteria: jest.fn(),
    create: jest.fn(),
    getCartItemsByCriteria: jest.fn(),
    createCartItem: jest.fn(),
    getCartItemByUuid: jest.fn(),
    deleteCartItem: jest.fn(),
    updateCartItem: jest.fn(),
};

const productRepositoryMock: jest.Mocked<IProductRepository> = {
    create: jest.fn(),
    getByUuid: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createProductVariant: jest.fn(),
    updateProductVariant: jest.fn(),
    getProductVariantByUuid: jest.fn(),
    deleteProductVariant: jest.fn(),
    getProductVariantsByProduct: jest.fn(),
    getProductVariantsByCriteriaExtended: jest.fn(),
    getProductFilter: jest.fn(),
    getProductVariantExtended: jest.fn(),
    getAllProducts: jest.fn(),
    assignTagsForProductVariant: jest.fn(),
};

beforeAll(() => {
    const container = new Container();
    container.bind<ICartService>(APP_TYPES.CART_SERVICE).to(CartService);
    container.bind<ILogger>(APP_TYPES.LOGGER_SERVICE).toConstantValue(loggerServiceMock);
    container.bind<ICartRepository>(APP_TYPES.CART_REPOSITORY).toConstantValue(cartRepositoryMock);
    container.bind<IProductRepository>(APP_TYPES.PRODUCT_REPOSITORY).toConstantValue(productRepositoryMock);

    cartService = container.get(APP_TYPES.CART_SERVICE);
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Cart service', () => {
    const CART: CartModel = {
        uuid: randomUUID(),
        user_id: randomUUID(),
        created_at: new Date(),
        updated_at: new Date(),
    };

    const CART_ITEM: CartItemModel = {
        uuid: randomUUID(),
        cart_id: CART.uuid,
        product_variant_id: randomUUID(),
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date(),
    };

    describe('create', () => {
        it('should return already exist cart', async () => {
            cartRepositoryMock.getCartByUniqueCriteria.mockResolvedValueOnce(CART);
            const result = await cartService.create(CART.user_id);

            expect(result).toEqual(CART);
            expect(cartRepositoryMock.getCartByUniqueCriteria).toHaveBeenCalledWith({ user_id: CART.user_id });
        });

        it('should create a new cart and return', async () => {
            cartRepositoryMock.getCartByUniqueCriteria.mockResolvedValueOnce(null);
            cartRepositoryMock.create.mockResolvedValueOnce(CART);
            const result = await cartService.create(CART.user_id);

            expect(result).toEqual(CART);
            expect(cartRepositoryMock.getCartByUniqueCriteria).toHaveBeenCalledWith({ user_id: CART.user_id });
            expect(cartRepositoryMock.create).toHaveBeenCalledWith(CART.user_id);
        });
    });

    describe('getCart', () => {
        it('should find a cart and return', async () => {
            cartRepositoryMock.getCartByUniqueCriteria.mockResolvedValueOnce(CART);
            const result = await cartService.getCart(CART.user_id);

            expect(result).toEqual(CART);
            expect(cartRepositoryMock.getCartByUniqueCriteria).toHaveBeenCalledWith({ user_id: CART.user_id });
        });

        it('should return null', async () => {
            cartRepositoryMock.getCartByUniqueCriteria.mockResolvedValueOnce(null);
            const result = await cartService.getCart(CART.user_id);

            expect(result).toEqual(null);
            expect(cartRepositoryMock.getCartByUniqueCriteria).toHaveBeenCalledWith({ user_id: CART.user_id });
        });
    });

    describe('createCartItem', () => {
        const randomProductVariantId = randomUUID();

        it('should return already exist item', async () => {
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValueOnce([CART_ITEM]);

            const result = await cartService.createCartItem(
                {
                    quantity: 1,
                    product_variant_id: randomProductVariantId,
                },
                CART.uuid,
            );

            expect(result).toEqual(CART_ITEM);
            expect(cartRepositoryMock.getCartItemsByCriteria).toHaveBeenCalledWith({
                cart_id: CART.uuid,
                product_variant_id: randomProductVariantId,
            });
        });

        it('should throw error (product variant not found)', async () => {
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValueOnce([]);
            productRepositoryMock.getProductVariantByUuid.mockResolvedValueOnce(null);
            await expect(
                cartService.createCartItem(
                    {
                        quantity: 1,
                        product_variant_id: randomProductVariantId,
                    },
                    CART.uuid,
                ),
            ).rejects.toThrow(ERROR.PRODUCT_NOT_FOUND);
            expect(productRepositoryMock.getProductVariantByUuid).toHaveBeenCalledWith(randomProductVariantId);
        });

        it('should create cart item and return', async () => {
            const product_variant: ProductVariantModel = {
                uuid: randomUUID(),
                product_id: randomUUID(),
                rating: 1,
                price: 199,
                size: SIZE.LARGE,
                stock: 1,
                created_at: new Date(),
                updated_at: new Date(),
            };
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValueOnce([]);
            productRepositoryMock.getProductVariantByUuid.mockResolvedValueOnce(product_variant);
            cartRepositoryMock.createCartItem.mockResolvedValueOnce(CART_ITEM);

            const result = await cartService.createCartItem(
                {
                    quantity: 1,
                    product_variant_id: randomProductVariantId,
                },
                CART.uuid,
            );

            expect(result).toEqual(CART_ITEM);
            expect(cartRepositoryMock.createCartItem).toHaveBeenCalledWith({
                cart_id: CART.uuid,
                product_variant_id: randomProductVariantId,
                quantity: 1,
            });
        });
    });

    describe('deleteCartItem', () => {
        it('should throw error (cart item not found)', async () => {
            cartRepositoryMock.getCartItemByUuid.mockResolvedValueOnce(null);

            await expect(cartService.deleteCartItem(CART_ITEM.uuid)).rejects.toThrow(ERROR.CART_ITEM_IS_NOT_FOUND);
            expect(cartRepositoryMock.getCartItemByUuid).toHaveBeenCalledWith(CART_ITEM.uuid);
        });

        it('should delete cart item and return success', async () => {
            cartRepositoryMock.getCartItemByUuid.mockResolvedValueOnce(CART_ITEM);
            const result = await cartService.deleteCartItem(CART_ITEM.uuid);

            expect(result).toEqual({ isSuccess: true });
            expect(cartRepositoryMock.deleteCartItem).toHaveBeenCalledWith(CART_ITEM.uuid);
        });
    });

    describe('getCartItems', () => {
        it('should find all cat items', async () => {
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValueOnce([CART_ITEM]);
            const result = await cartService.getCartItems(CART.uuid);

            expect(result).toEqual([CART_ITEM]);
            expect(cartRepositoryMock.getCartItemsByCriteria).toHaveBeenCalledWith({ cart_id: CART.uuid });
        });
    });

    describe('updateCartItem', () => {
        it('should throw error (cart item not found)', async () => {
            cartRepositoryMock.getCartItemByUuid.mockResolvedValueOnce(null);

            await expect(cartService.updateCartItem(CART.uuid, CART_ITEM.uuid, { quantity: 1 })).rejects.toThrow(
                ERROR.CART_ITEM_IS_NOT_FOUND,
            );
            expect(cartRepositoryMock.getCartItemByUuid).toHaveBeenCalledWith(CART_ITEM.uuid);
        });

        it('should throw error (cart id !=  cart item cart_id)', async () => {
            cartRepositoryMock.getCartItemByUuid.mockResolvedValueOnce({ ...CART_ITEM, cart_id: randomUUID() });

            await expect(cartService.updateCartItem(CART.uuid, CART_ITEM.uuid, { quantity: 1 })).rejects.toThrow(
                ERROR.CART_ITEM_IS_NOT_FOUND,
            );
            expect(cartRepositoryMock.getCartItemByUuid).toHaveBeenCalledWith(CART_ITEM.uuid);
        });

        it('should update cart item and return', async () => {
            cartRepositoryMock.getCartItemByUuid.mockResolvedValueOnce(CART_ITEM);
            cartRepositoryMock.updateCartItem.mockResolvedValueOnce(CART_ITEM);

            const result = await cartService.updateCartItem(CART.uuid, CART_ITEM.uuid, { quantity: 1 });

            expect(result).toEqual(CART_ITEM);
            expect(cartRepositoryMock.updateCartItem).toHaveBeenCalledWith({
                uuid: CART_ITEM.uuid,
                data: {
                    quantity: 1,
                },
            });
        });
    });

    describe('syncCart', () => {
        const input = {
            items: [
                { product_variant_id: CART_ITEM.product_variant_id, quantity: 10 },
                { product_variant_id: randomUUID(), quantity: 2 },
            ],
        };
        it('should return current items', async () => {
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValue([CART_ITEM]);
            const result = await cartService.syncCart(CART.uuid, { items: [] });

            expect(result).toEqual([
                {
                    uuid: CART_ITEM.uuid,
                    product_variant_id: CART_ITEM.product_variant_id,
                    quantity: CART_ITEM.quantity,
                },
            ]);

            expect(cartRepositoryMock.getCartItemsByCriteria).toHaveBeenCalledWith({ cart_id: CART.uuid });
        });

        it('should create new and update old', async () => {
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValue([CART_ITEM]);
            await cartService.syncCart(CART.uuid, input);

            expect(cartRepositoryMock.getCartItemsByCriteria).toHaveBeenCalledTimes(2);

            expect(cartRepositoryMock.createCartItem).toHaveBeenCalledTimes(1);
            expect(cartRepositoryMock.createCartItem).toHaveBeenCalledWith([
                {
                    cart_id: CART.uuid,
                    product_variant_id: input.items[1].product_variant_id,
                    quantity: input.items[1].quantity,
                },
            ]);

            expect(cartRepositoryMock.updateCartItem).toHaveBeenCalledTimes(1);
            expect(cartRepositoryMock.updateCartItem).toHaveBeenCalledWith({
                uuid: CART_ITEM.uuid,
                data: { quantity: input.items[0].quantity },
            });
        });
    });
});
