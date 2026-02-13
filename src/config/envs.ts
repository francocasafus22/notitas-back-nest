import "dotenv/config"
import * as joi from "joi"

interface EnvVars {
    PORT: number
    MONGO_URI: string
    JWT_SECRET: string,
    FRONT_URL: string
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    MONGO_URI: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    FRONT_URL: joi.string().required()
}).unknown(true)

const { error, value } = envSchema.validate(process.env)

if(error){
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    port : envVars.PORT,
    mongo_uri : envVars.MONGO_URI,
    jwt_secret: envVars.JWT_SECRET,
    front_url: envVars.FRONT_URL
}