import { ORDER_BY_USERS, ORDER_BY_USERS_ENUM } from 'contracts-green-shop';

export const UsersOrderByMap = new Map<ORDER_BY_USERS, string>([
    [ORDER_BY_USERS_ENUM.FIRST_NEW, 'desc'],
    [ORDER_BY_USERS_ENUM.FIRST_OLD, 'asc'],
]);
