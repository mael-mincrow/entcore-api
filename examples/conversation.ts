import * as dotenv from "dotenv";
import {NeoClient} from "~/structures/Client";
import * as process from "node:process";
import {NeoConversationSystemFolder} from "../src/types/conversation";
import {readFile} from "node:fs/promises";
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

	// List User Folders
	const folders = await instance.conversation.getUserFolders();
	console.log("\nUser Folders:");
	folders.forEach(folder => {
		console.log(`(${folder.nbMessages}) ${folder.name}`);
	});

	// Create a new folder
	console.log("\nCreating a new folder named 'entcore-api'...");
	const newFolder = await instance.conversation.createUserFolders("entcore-api");
	console.log("New folder created with ID:", newFolder.id);

	// Create a subfolder in the new folder
	console.log("\nCreating a subfolder named 'demo' in the 'entcore-api' folder...");
	const subFolder = await instance.conversation.createUserFolders("demo", newFolder.id);
	console.log("Subfolder created with ID:", subFolder.id);

	// List Messages in inbox
	const messages = await instance.conversation.listFolder(NeoConversationSystemFolder.INBOX, {page_size: 5});
	console.log("\nInbox Messages:");
	messages.forEach(message => {
		console.log(`[${message.from?.displayName || "Unknown"}] ${message.subject}`);
	});

	if (messages.length > 0) {
		// Read a specific message
		console.log("\nReading the first message in the inbox...");
		const messageId = messages[0].id;
		const message = await instance.conversation.getMessage(messageId);
		console.log(`Subject: ${message.subject}`);
		console.log(`From: ${message.from?.displayName || "Unknown"}`);
		console.log(`Body: ${message.body}`);

		// Mark the message as read
		console.log("\nMarking the message as unread...");
		await instance.conversation.markAsUnread(messageId);
		console.log("Message marked as unread successfully.");

		// Mark the message as read
		console.log("\nMarking the message as read...");
		await instance.conversation.markAsRead(messageId);
		console.log("Message marked as read successfully.");

		// Move the message to the new folder
		console.log("\nMoving the message to the 'entcore-api' folder...");
		await instance.conversation.moveMessageToUserFolder(messageId, newFolder.id);
		console.log("Message moved to 'entcore-api' folder successfully.");

		// Move the message to the root folder
		console.log("\nMoving the message to the root folder...");
		await instance.conversation.moveMessageToRootFolder(messageId);
		console.log("Message moved to root folder successfully.");

		// Delete entcore-api folder
		console.log("\nDeleting the 'entcore-api' folder... (API takes some time to delete, so this may take a while)");
		await instance.conversation.deleteUserFolder(newFolder.id);
		console.log("'entcore-api' folder deleted successfully.");
	} else {
		console.log("\nNo messages found in the inbox.");
	}

	// List available recipients
	console.log("\nListing available recipients...");
	const recipients = await instance.conversation.getAvailableRecipients();
	recipients.groups.forEach(recipient => {
		console.log(`[${recipient.profile}] ${recipient.name}`)
	})
	recipients.users.forEach(recipient => {
		console.log(`[${recipient.profile}] ${recipient.displayName}`)
	})

	// Create a draft message
	console.log("\nCreating a draft message...");
	const draft = await instance.conversation.createDraft({
		subject: "[ENTCORE-API] Test Draft",
		to: [userInfo.userId],
		body: "Currently, this draft as not been updated.",
	});
	console.log(`Draft created with ID: ${draft.id}`);

	// Update the draft message
	console.log("\nUpdating the draft message...");
	await instance.conversation.updateDraft(draft.id, {
		to: [userInfo.userId],
		body: "This draft has been updated.",
	});
	console.log("Draft updated successfully.");

	// Send the draft message
	console.log("\nSending the draft message...");
	const sentMessage = await instance.conversation.sendMessage({
		to: [userInfo.userId],
		subject: "[ENTCORE-API] Test Send",
		body: "This draft has been sent.",
	}, draft.id);
	console.log("Draft sent successfully.");

	// Moving the received message to the trash folder
	console.log("\nMoving the sent message to the trash folder...");
	await instance.conversation.moveMessageToTrash(sentMessage.id);
	console.log("Message moved to trash successfully.");

	// Delete the draft message
	console.log("\nDeleting the message from the trash folder...");
	await instance.conversation.deleteMessage(sentMessage.id);
	console.log("Message deleted successfully.");

	// Create a new draft message
	console.log("\nCreating a new draft message...");
	const newDraft = await instance.conversation.createDraft({
		subject: "[ENTCORE-API] Test Draft Attachment",
		to: [userInfo.userId],
		body: "This is draft will be sent with an attachment.",
	});
	console.log("Draft created successfully.");

	// Upload an attachment to the draft
	console.log("\nAdd an attachment to the draft message...");
	// Read the file .upload_file
	const fs = require("node:fs");
	const filePath = "./examples/.upload_file"; // Path to the file you want to upload
	if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
	const buffer = await readFile(filePath);
	const blob = new Blob([buffer], { type: 'application/octet-stream' });
	const attachment = await instance.conversation.addAttachmentToDraft(newDraft.id, blob, "upload_file.txt");
	console.log("Attachment added successfully with ID:", attachment.id);

	// Generate the download URL for the attachment
	console.log("\nGenerating download URL for the attachment...");
	const downloadUrl = instance.conversation.generateAttachmentUrl(newDraft.id, attachment.id);
	console.log("Download URL:", downloadUrl);

	// Delete the attachment from the draft
	console.log("\nDeleting the attachment from the draft message...");
	await instance.conversation.deleteAttachmentToDraft(newDraft.id, attachment.id);
	console.log("Attachment deleted successfully.");

	// Move the draft message to the trash folder
	console.log("\nMoving the draft message to the trash folder...");
	await instance.conversation.moveMessageToTrash(newDraft.id);
	console.log("Draft message moved to trash successfully.");

	// Restore the draft message from the trash folder
	console.log("\nRestoring the draft message from the trash folder...");
	await instance.conversation.restoreMessage(newDraft.id);
	console.log("Draft message restored successfully.");

	// Move the restored draft message to the trash folder again
	console.log("\nMoving the restored draft message to the trash folder again...");
	await instance.conversation.moveMessageToTrash(newDraft.id);
	console.log("Draft message moved to trash successfully.");

	// Check the trash folder
	console.log("\nChecking the trash folder...");
	const trashMessages = await instance.conversation.listFolder(NeoConversationSystemFolder.TRASH);
	console.log("Trash Messages:");
	trashMessages.forEach(message => {
		console.log(`[${message.from?.displayName || "Unknown"}] ${message.subject}`);
	});

	// Empty the trash folder
	if (trashMessages.length == 1) {
		console.log("\nEmptying the trash folder...");
		await instance.conversation.emptyTrash();
		console.log("Trash folder emptied successfully.");
	} else {
		console.log("\n[WARNING] There are multiple messages in the trash folder, skipping emptying to avoid error.");
	}
	process.exit(0);
}();