interface NeoInstance {
	name: string;
	url: string;
	auth_url?: string;
	oauth_client_id: string;
	oauth_client_secret: string;
}

export type { NeoInstance };