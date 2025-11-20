import { Inject, Injectable, Scope } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import googleOauthConfig from "../config/google-oauth.config";
import type { ConfigType } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-oauth') {
    constructor(
        @Inject(googleOauthConfig.KEY) private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
        private readonly authService: AuthService,
    ) {
        super({
            clientID: googleConfig.clientId!,
            clientSecret: googleConfig.clientSecret!,
            callbackURL: googleConfig.callBackUrl,
            scope: ["email", "profile"]
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        
        const user = await this.authService.validateGoogleUser({
            email: profile.emails[0].value,
            userName: profile.displayName,
            password: '',
            profilePicture: profile.photos?.[0]?.value ?? null,
            phoneNumber: profile.phoneNumber ?? null,
            userLocation: '' ,//profile.location ?? null,
            latitude: profile.latitude ?? null,
            longitude: profile.longitude ?? null
        })
        done(null, user)
        // return user;
    }
}