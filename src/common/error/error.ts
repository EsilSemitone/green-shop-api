export const ERROR = {
    UNAUTHORIZED: 'Пользователь не авторизован',

    ERROR_PARSE_ENV_FILE: 'Произошла ошибка при парсинге env',
    ERROR_GET_ENV_PARAM: (key: string) => `Произошла ошибка при получении ${key} из env`,
    USER_ALREADY_EXIST: 'Пользователь с таким email уже существует',
    USER_NOT_FOUND: 'Пользователя не существует',
    INVALID_LOGIN_DATA: 'Не верная почта или пароль',
    PRODUCT_NOT_FOUND: 'Продукт с таким id не найден',
    PRODUCT_VARIANT_NOT_FOUND: 'Вариант продукта с таким id не найден',

    EXPECTED_FILES: 'Ожидалось что будет передан хотя бы один файл',

    INVALID_REFRESH_TOKEN: 'Не валидный refresh токен',
    INVALID_ACCESS_TOKEN: 'Не валидный access токен',

    CART_IS_NOT_FOUND: 'Корзина не найдена',
    CART_ITEM_IS_NOT_FOUND: 'Елемент корзины не найден',
    INVALID_CART_USER: 'Корзина не принадлежит пользователю',

    ADDRESS_IS_NOT_FOUND: 'Адрес не найден',

    PAYMENT_METHOD_IS_NOT_FOUND: 'Способ оплаты не найден',

    STOCK_ERROR: (product?: string) => `Недостаточно товара на складе ${product ? product : ''}`,

    ORDER_IS_NOT_FOUND: 'Заказ не найден',

    PAYMENT_ERROR: 'Произошла ошибка при оплате',

    YOOKASSA_EVENT_ERROR: 'Получен тип события который не обрабатывается',
};
