
import { OAuth2Client } from "google-auth-library";
import { envVars } from "../config/env";

const client = new OAuth2Client(envVars.OAUTH_CLIENT_ID);

export async function verifyGoogleToken(idToken: string) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: envVars.OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return payload;
}