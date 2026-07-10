import * as dotenv from "dotenv";
import {NeoClient} from "~/structures/Client";
import * as process from "node:process";
import {NeoPublicInstances} from "../src/const/instances";

void async function main () {
	// Load environment variables from .env file
	const result = dotenv.config({quiet: true});

	if (result.error)
	{
		console.error("Error loading .env file:", result.error);
		process.exit(1);
	}

	// Validate required environment variables
	if (!process.env.NEO_SAML_ASSERTION)
		throw new Error("NEO_SAML_ASSERTION environment variable is not set.");

	const instance = new NeoClient(NeoPublicInstances.MonEnt16);

	// Perform SAML login using the provided assertion
	const token = await instance.auth.loginSAML(process.env.NEO_SAML_ASSERTION);

	console.log("SAML Login Successful:", token);
	process.exit(0);
}();