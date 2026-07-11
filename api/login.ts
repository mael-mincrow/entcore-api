import type { VercelRequest, VercelResponse } from "@vercel/node";
import { NeoRestManager } from "../src/rest/RESTManager";
import { NeoAuth } from "../src/routes/Auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    const instance = {
        url: process.env.NEO_URL,
        oauth_client_id: process.env.NEO_CLIENT_ID,
        oauth_client_secret: process.env.NEO_CLIENT_SECRET,
    };

    const restManager = new NeoRestManager(instance as any);
    const auth = new NeoAuth(restManager, {} as any);

    try {
        const credentials = await auth.loginUsername(username, password);
        return res.status(200).json(credentials);
    } catch (err: any) {
        return res.status(401).json({ error: err.message });
    }
}
