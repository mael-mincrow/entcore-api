import {NeoRestManager} from "~/rest/RESTManager";
import {NeoAuthCredentials} from "~/types/auth";
import {TOKEN_ERROR} from "~/const/error";
import {NeoMediacentreResourceSearch, NeoMediacentreResponse, NeoMediacentreSource} from "~/types/mediacentre";
import {MEDIACENTRE_SEARCH} from "~/rest/endpoints";

export class NeoMediacentre {
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

	public async searchFromSource(source: NeoMediacentreSource | NeoMediacentreSource[], query: string): Promise<NeoMediacentreResourceSearch[]> {
		this.checkToken();
		const sources: NeoMediacentreSource[] = !Array.isArray(source) ? [source] : source;
		const jsonData = {
			data: {query},
			event: "search",
			sources,
			state: "PLAIN_TEXT"
		}
		const res = await this.restManager.get<NeoMediacentreResponse<NeoMediacentreResourceSearch>[]>(
			MEDIACENTRE_SEARCH(JSON.stringify(jsonData)),
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
		return res.map((r) => r.data);
	}

	public async getResourcesFromSource(source: NeoMediacentreSource | NeoMediacentreSource[]): Promise<NeoMediacentreResourceSearch[]> {
		return this.searchFromSource(source, ".*");
	}
}