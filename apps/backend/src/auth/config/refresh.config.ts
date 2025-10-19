import { registerAs } from "@nestjs/config";
import { JwtSignOptions } from "@nestjs/jwt";

export default registerAs ('refresh', (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET,
    expiresIn: parseInt(process.env.REFRESH_EXPIRES_IN ?? '7d', 10)
}))