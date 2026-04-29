
import dotenv from 'dotenv';
dotenv.config()


interface EnvConfig {

    PORT: string,
    MONGO_URI: string,

    NODE_ENV: "development" | "production",

    JWT_ACCESS_EXPIRES: string,
    JWT_ACCESS_SECRET: string,


    JWT_REFRESH_EXPIRES: string,
    JWT_REFRESH_SECRET: string,

    ADMIN_EMAIL: string,
    ADMIN_PASSWORD: string,

    BCRYPT_SALT_ROUND: string,

    APP_PASSWORD: string,

    CLOUD_API_SECRET: string,
    CLOUD_API_KEY: string,
    CLOUD_NAME: string,
    STRIPE_SECRET_KEY: string,
    WEB_HOOK_SECRET: string,


    UNIVERSE_DOMAIN : string,
    CLIENT_X509_CERT_URL : string,
    AUTH_PROVIDER_X509_CERT_URL : string,
    TOKEN_URI : string,
    AUTH_URI : string,
    CLIENT_EMAIL : string,
    CLIENT_ID : string,
    PRIVATE_KEY : string,
    PRIVATE_KEY_ID : string,
    PROJECT_ID : string,
    TYPE : string,


    GOOGLE_MAP_API_KEY : string,


    OAUTH_CLIENT_ID:string,
    OAUTH_CLIENT_SECRET : string
}


const loadEnvVariables = (): EnvConfig => {

    const requiredEnvVariables: string[] = ['PORT', 'BCRYPT_SALT_ROUND', 'APP_PASSWORD', 'MONGO_URI', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'JWT_REFRESH_EXPIRES', 'JWT_REFRESH_SECRET', 'JWT_ACCESS_EXPIRES', 'JWT_ACCESS_SECRET', 'MONGO_URI', 'PORT', 'CLOUD_API_SECRET', 'CLOUD_API_KEY', 'CLOUD_NAME', 'STRIPE_SECRET_KEY', 'WEB_HOOK_SECRET' , 'UNIVERSE_DOMAIN', 'CLIENT_X509_CERT_URL', 'AUTH_PROVIDER_X509_CERT_URL', 'TOKEN_URI', 'AUTH_URI', 'CLIENT_EMAIL', 'CLIENT_ID', 'PRIVATE_KEY', 'PRIVATE_KEY_ID', 'PROJECT_ID', 'TYPE','GOOGLE_MAP_API_KEY','OAUTH_CLIENT_ID','OAUTH_CLIENT_SECRET']


    requiredEnvVariables?.forEach(key => {

        if (!process.env[key]) {
            throw new Error(`Missing require enviroment variable  ${key}`)
        }
    })


    return {

        PORT: process.env.PORT as string,
        MONGO_URI: process.env.MONGO_URI as string,

        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,

        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,


        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,

        NODE_ENV: process.env.NODE_ENV as "development" | "production",

        APP_PASSWORD: process.env.APP_PASSWORD as string,

        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,




        CLOUD_API_SECRET: process.env.CLOUD_API_SECRET as string,
        CLOUD_API_KEY: process.env.CLOUD_API_KEY as string,
        CLOUD_NAME: process.env.CLOUD_NAME as string,


        // stripe
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
        WEB_HOOK_SECRET: process.env.WEB_HOOK_SECRET as string, 


        // firebase config
        UNIVERSE_DOMAIN : process.env.UNIVERSE_DOMAIN as string,
        CLIENT_X509_CERT_URL : process.env.CLIENT_X509_CERT_URL as string, 
        AUTH_PROVIDER_X509_CERT_URL : process.env.AUTH_PROVIDER_X509_CERT_URL as string,
        TOKEN_URI : process.env.TOKEN_URI as string, 
        AUTH_URI : process.env.TOKEN_URI as string, 
        CLIENT_EMAIL : process.env.CLIENT_EMAIL as string, 
        CLIENT_ID : process.env.CLIENT_ID as string , 
        PRIVATE_KEY : process.env.PRIVATE_KEY as string ,
        PRIVATE_KEY_ID : process.env.PRIVATE_KEY_ID as string, 
        PROJECT_ID : process.env.PROJECT_ID as string , 
        TYPE : process.env.TYPE as string,


        // google map api key
        GOOGLE_MAP_API_KEY : process.env.GOOGLE_MAP_API_KEY as string,


        // google login
        OAUTH_CLIENT_ID : process.env.OAUTH_CLIENT_ID as string,
        OAUTH_CLIENT_SECRET : process.env.OAUTH_CLIENT_SECRET as string

    }
}




export const envVars = loadEnvVariables()