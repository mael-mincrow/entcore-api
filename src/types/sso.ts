interface NeoSSOPronote {
	/** The structure ID of the school */
	structureId: string;
	/** The URL of the PRONOTE instance */
	address: URL;
	/** Some information from the PRONOTE instance */
	xmlResponse: string;
}

export type {
	NeoSSOPronote
}