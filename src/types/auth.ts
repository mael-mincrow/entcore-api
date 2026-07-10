enum NeoAuthScope {
	Auth = 'auth',
	UserInfo = 'userinfo',
	Timeline = 'timeline',
	UserBook = 'userbook',
	Audience = 'audience',
	Explorer = 'explorer',
	Blog = 'blog',
	CollaborativeWall = 'collaborativewall',
	CAS = 'cas',
	LVS = 'lvs',
	Conversation = 'conversation',
	Formulaire = 'formulaire',
	Homeworks = 'homeworks',
	Mediacentre = 'mediacentre',
	Actualites = 'actualites',
	Pronote = 'pronote',
	SchoolBook = 'schoolbook',
	Scrapbook = 'scrapbook',
	Edt = 'edt',
	VieScolaire = 'viescolaire',
	Diary = 'diary',
	Presences = 'presences',
	Wiki = 'wiki',
	Workspace = 'workspace',
	Infra = 'infra',
	Directory = 'directory',
	Portal = 'portal',
	SSO = 'sso',
	Zimbra = 'zimbra',
	Incidents = 'incidents',
	Competences = 'competences',
	Support = 'support',
}

interface NeoAuthAction {
	name: string;
	displayName: string;
	type: string;
}

interface NeoAuthApplication {
	name: string;
	address: string;
	icon: string;
	target: string;
	displayName: string;
	display: boolean;
	prefix: string;
}


interface NeoAuthWidget {
	id: string;
	name: string;
	path: string;
	js: string;
	i18n: string;
	application: string;
	mandatory: boolean;
}

interface NeoAuthFunction {
	code: string;
	functioName?: string;
	scope: string[];
	structureExternalIds?: string[];
	subjects?: Map<string, NeoAuthSubject>;
}

interface NeoAuthSubject {
	subjectCode: string;
	subjectName: string;
	scope: string[];
	structureExternalIds: string[];
}

interface NeoAuthSessionMetatdata {
	nameID: string;
	SessionIndex: string;
	_id: string;
	userId: string;
}

interface NeoAuthSession {
	apps: NeoAuthApplication[];
	authorizedActions: NeoAuthAction[];
	birthDate: string;
	childrenIds: string[];
	classNames: string[];
	classes: string[];
	deletePending: boolean;
	email?: string;
	externalId: string;
	federated: boolean;
	federatedlDP?: string;
	firstName: string;
	forceChangePassword?: boolean;
	functions: NeoAuthFunction[];
	groupsIds: string[];
	hasApp: boolean;
	hasPw: boolean;
	ignoreMFA?: boolean;
	lastName: string;
	level: string;
	login: string;
	mobile?: any; // Can't find the type for this field
	needRevalidateTerms: boolean;
	optionEnabled: any[]; // Can't find the type for this field
	sessionMetadata: NeoAuthSessionMetatdata;
	structureNames: string[];
	structures: string[];
	type: string;
	uai: string;
	userId: string;
	username: string;
	widgets: NeoAuthWidget[];
}

interface NeoAuthCredentials {
	/** Type of the token, usually "Bearer" */
	token_type?: string;
	/** Bearer token */
	access_token?: string;
	/** Refresh token to get a new access token */
	refresh_token?: string;
	/** Date until the access token expires */
	expires_at: number;
	/** Scopes granted to the access token */
	scope: Array<NeoAuthScope>;
}

interface NeoAuthToken {
	/** Type of the token, usually "Bearer" */
	token_type: string;
	/** Bearer token */
	access_token: string;
	/** Second until the access token expires */
	expires_in: number;
}

export { NeoAuthScope };
export type {
	NeoAuthAction,
	NeoAuthApplication,
	NeoAuthWidget,
	NeoAuthFunction,
	NeoAuthSubject,
	NeoAuthSessionMetatdata,
	NeoAuthSession,
	NeoAuthCredentials,
	NeoAuthToken
};
