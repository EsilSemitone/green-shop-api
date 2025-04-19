export const ERROR = {
    ERROR_PARSE_ENV_FILE: 'Произошла ошибка при парсинге env',
    ERROR_GET_ENV_PARAM: (key: string) => `Произошла ошибка при получении ${key} из env`,
    USER_ALREADY_EXIST: "Пользователь с таким email уже существует",
    USER_NOT_FOUND: "Пользователя с таким email не существует",
    INVALID_LOGIN_DATA: "Не верная почта или пароль",
    
};
