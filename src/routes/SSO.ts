import {NeoRestManager} from "~/rest/RESTManager";
import {CAS_OAUTH_LOGIN, SSO_PRONOTE} from "~/rest/endpoints";
import {NeoAuthCredentials} from "~/types/auth";
import {TOKEN_ERROR} from "~/const/error";
import {NeoSSOPronote} from "~/types/sso";

export class NeoSSO {
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

	public async getPronoteInstanceLinked(): Promise<Array<NeoSSOPronote>> {
		this.checkToken();
		return await this.restManager.get<Array<NeoSSOPronote>>(
			SSO_PRONOTE(),
			{
				"Authorization": `Bearer ${this.credentials.access_token}`
			}
		)
	}

	public async generatePronoteAuthorizedUrl(sso: NeoSSOPronote): Promise<URL> {
		this.checkToken();

		let pronote_endpoint = "";
		if (sso.xmlResponse.includes("Eleve"))
			pronote_endpoint = "mobile.eleve.html";
		const result = await this.restManager.get<Headers>(
			CAS_OAUTH_LOGIN(`${sso.address.toString()}${pronote_endpoint}`),
			{
				"Authorization": `Bearer ${this.credentials.access_token}`
			}
		)
		if (result.has("Location"))
			return new URL(result.get("Location")!);
		throw new Error("No Location header found in the response.");
	}
}