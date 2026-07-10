enum NeoMediacentreSource {
	GAR = 'fr.openent.mediacentre.source.GAR',
	MOODLE = 'fr.openent.mediacentre.source.Moodle',
	SIGNET = 'fr.openent.mediacentre.source.Signet',
}

enum NeoMediacentreSectionType {
	EXTERNAL_RESOURCES = 'externalresources',
	FAVORITES = 'favorites',
	PINS = 'pins',
	SIGNETS = 'signets',
	TEXTBOOKS = 'textbooks',
}

interface NeoMediacentreResource {
	title: string;
	editors: string[];
	authors: string | string[];
	image: string;
	disciplines: string[];
	levels: string[];
	document_types: string[];
	link: string;
	source: NeoMediacentreSource;
	plain_text: string;
	id: string;
	types?: string[];
	favorite?: boolean;
	date: number;
	structure_name?: string;
	structure_uai?: string;
}


interface NeoMediacentreResources {
	externals: NeoMediacentreResource[];
	pins: NeoMediacentreResource[];
	signets: NeoMediacentreResource[];
	textbooks: NeoMediacentreResource[];
}

interface NeoMediacentreResourceFilter {
	name: string;
	isActive: boolean;
}

interface NeoMediacentreResourceFilters {
	disciplines: NeoMediacentreResourceFilter[];
	levels: NeoMediacentreResourceFilter[];
	sources: NeoMediacentreResourceFilter[];
	themes: NeoMediacentreResourceFilter[];
	types: NeoMediacentreResourceFilter[];
}

interface NeoMediacentreResourceSearch {
	source: NeoMediacentreSource;
	resources: NeoMediacentreResource[];
}

interface NeoMediacentreResponse<T> {
	event: string;
	state: string;
	status: 'ok' | 'ko';
	data: T;
}

export type {
	NeoMediacentreResource,
	NeoMediacentreResources,
	NeoMediacentreResourceFilter,
	NeoMediacentreResourceFilters,
	NeoMediacentreResourceSearch,
	NeoMediacentreResponse,
}
export {
	NeoMediacentreSource,
	NeoMediacentreSectionType,
};