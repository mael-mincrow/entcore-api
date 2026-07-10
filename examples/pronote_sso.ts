import * as dotenv from "dotenv";
import {NeoClient} from "~/structures/Client";
import * as process from "node:process";
import {NeoPublicInstances} from "../src/const/instances";

void async function main () {
	// Load environment variables from .env file
	dotenv.config({quiet: true});

	// Validate required environment variables
	if (!process.env.NEO_REFRESH_TOKEN)
		throw new Error("NEO_REFRESH_TOKEN environment variable is not set.");

	const instance = new NeoClient(NeoPublicInstances.MonEnt16);

	// Perform SAML login using the provided assertion
	await instance.auth.refreshToken(process.env.NEO_REFRESH_TOKEN);

	console.log("Auth Successful !");

	// Fetch Pronote SSO links
	const pronoteSSO = await instance.sso.getPronoteInstanceLinked();
	console.log("Pronote SSO Links:");
	pronoteSSO.forEach(sso => {
		console.log(`${sso.structureId}- ${sso.address}: ${sso.xmlResponse.slice(0, 100)}...`);
	});

	if (pronoteSSO.length > 0)
	{
		console.log(`Generating authorized URL for the ${pronoteSSO[0].address} Pronote SSO link...`);
		const authorizedUrl = await instance.sso.generatePronoteAuthorizedUrl(pronoteSSO[0]);
		console.log(`Authorized URL: ${authorizedUrl}`);
	}
	process.exit(0);
}();