export const environments = {
    dev: {
        baseUrl: 'https://www.saucedemo.com',
        apiUrl: 'https://www.saucedemo.com/api',
    },
    staging: {
        baseUrl: 'https://www.saucedemo.com',
        apiUrl: 'https://www.saucedemo.com/api',
    },
    prod: {
        baseUrl: 'https://www.saucedemo.com',
        apiUrl: 'https://www.saucedemo.com/api',
    },
};

export type Environment = keyof typeof environments;

export const getEnvironment = () => {
    const env = (process.env.TEST_ENV as Environment) || 'dev';
    return environments[env];
};
