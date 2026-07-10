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

	// Perform Login
	console.log("Logging in with refresh token...");
	await instance.auth.refreshToken(process.env.NEO_REFRESH_TOKEN);
	console.log("Logged in Successful !");

	// Fetch user info
	console.log("\nFetching user info...");
	const userInfo = await instance.auth.getUserInfo();
	console.log("Hello, " + userInfo.username + "!");

	// Get the user avatar URL
	console.log("\nFetching your avatar URL...");
	const avatarUrl = instance.userbook.getAvatarURL(userInfo.userId);
	console.log(`Your avatar URL is: ${avatarUrl}`);
	process.exit(0);
}();