import {NeoRestManager} from "~/rest/RESTManager";
import {NeoAuthCredentials} from "~/types/auth";
import {NeoAuth} from "~/routes/Auth";
import {NeoConversation} from "~/routes/Conversation";
import {NeoSSO} from "~/routes/SSO";
import {NeoMediacentre} from "~/routes/Mediacentre";
import {NeoInstance} from "~/types/instance";
import {NeoUserbook} from "~/routes/Userbook";

export class NeoClient {
	private restManager: NeoRestManager;
	private credentials: NeoAuthCredentials = {
		expires_at: 0,
		scope: []
	}

	public auth: NeoAuth;
	public conversation: NeoConversation;
	public mediacentre: NeoMediacentre;
	public userbook: NeoUserbook;
	public sso: NeoSSO;

	constructor(instance: NeoInstance, credentials?: NeoAuthCredentials) {
		if (credentials)
			this.credentials = credentials;
		this.restManager = new NeoRestManager(instance);

		this.auth = new NeoAuth(this.restManager, this.credentials);
		this.conversation = new NeoConversation(this.restManager, this.credentials);
		this.mediacentre = new NeoMediacentre(this.restManager, this.credentials);
		this.userbook = new NeoUserbook(this.restManager, this.credentials);
		this.sso = new NeoSSO(this.restManager, this.credentials);
	}
}