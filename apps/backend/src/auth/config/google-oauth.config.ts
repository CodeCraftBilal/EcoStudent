import { registerAs } from "@nestjs/config";

export default registerAs('googleOauth', ()=>({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callBackUrl:process.env.GOOGLE_CALLBACK_URL,
}))