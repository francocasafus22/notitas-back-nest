import "dotenv/config"
import * as joi from "joi"

interface EnvVars {
    PORT: number
    MONGO_URI: string
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    MONGO_URI: joi.string().required()
}).unknown(true)

const { error, value } = envSchema.validate(process.env)

if(error){
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    port : envVars.PORT,
    mongo_uri : envVars.MONGO_URI
}