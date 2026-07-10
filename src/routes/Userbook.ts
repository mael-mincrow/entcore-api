import {NeoRestManager} from "~/rest/RESTManager";
import {NeoAuthCredentials} from "~/types/auth";
import { USERBOOK_AVATAR } from "~/rest/endpoints";
import {TOKEN_ERROR} from "~/const/error";
export class NeoUserbook {
	private restManager: NeoRestManager;
	private credentials: NeoAuthCredentials;

	constructor(restManager: NeoRestManager, credentials: NeoAuthCredentials) {
		this.restManager = restManager;
		this.credentials = credentials;
	}

	private checkToken(): void {
		if (!this.credentials.access_token)
			throw TOKEN_ERROR;
	}

	public getAvatarURL(userId: string): string {
		return `${this.restManager.getBaseURL()}/${USERBOOK_AVATAR(userId)}`;
	}
}