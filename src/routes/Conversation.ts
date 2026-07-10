import {NeoRestManager} from "~/rest/RESTManager";
import {NeoAuthCredentials} from "~/types/auth";
import {
	NeoConversationAttachmentId, NeoConversationAvailableRecipient,
	NeoConversationDraftId,
	NeoConversationFolder, NeoConversationFolderId,
	NeoConversationListParameters, NeoConversationMessage,
	NeoConversationMessageContent,
	NeoConversationMessageMetadata, NeoConversationSentMessage,
	NeoConversationSystemFolder
} from "~/types/conversation";
import {TOKEN_ERROR} from "~/const/error";
import {
	CONVERSATION_CREATE_DRAFT,
	CONVERSATION_DELETE,
	CONVERSATION_EMPTY_TRASH, CONVERSATION_FOLDER,
	CONVERSATION_FOLDER_MESSAGES,
	CONVERSATION_FOLDERS, CONVERSATION_FOLDERS_DELETE, CONVERSATION_MESSAGE,
	CONVERSATION_MESSAGE_ADD_ATTACHMENT,
	CONVERSATION_MESSAGE_ATTACHMENT, CONVERSATION_MOVE_FOLDER, CONVERSATION_MOVE_ROOT, CONVERSATION_RESTORE,
	CONVERSATION_SEND_MESSAGE, CONVERSATION_TOGGLE_UNREAD,
	CONVERSATION_TRASH,
	CONVERSATION_UPDATE_DRAFT, CONVERSATION_VISIBLE
} from "~/rest/endpoints";

export class NeoConversation {
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

	public async listFolder(folder: string | NeoConversationSystemFolder, params: NeoConversationListParameters = {}): Promise<NeoConversationMessageMetadata[]> {
		this.checkToken();
		return this.restManager.get<NeoConversationMessageMetadata[]>(
			CONVERSATION_FOLDER_MESSAGES(folder, params),
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async getMessage(messageId: string): Promise<NeoConversationMessage> {
		this.checkToken();
		return this.restManager.get<NeoConversationMessage>(
			CONVERSATION_MESSAGE(messageId),
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async getUserFolders(): Promise<NeoConversationFolder[]> {
		this.checkToken();
		return this.restManager.get<NeoConversationFolder[]>(
			CONVERSATION_FOLDERS(),
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async createUserFolders(name: string, parentId?: string): Promise<NeoConversationFolderId> {
		this.checkToken();
		return this.restManager.post<NeoConversationFolderId>(
			CONVERSATION_FOLDER(),
			{
				name,
				parentId
			},
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async deleteUserFolder(folderId: string): Promise<void> {
		this.checkToken();
		await this.restManager.delete<{}>(
			CONVERSATION_FOLDERS_DELETE(folderId),
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async moveMessageToRootFolder(messageId: string | string[]): Promise<void> {
		if (!Array.isArray(messageId))
			messageId = [messageId];
		this.checkToken();
		await this.restManager.put(
			`${CONVERSATION_MOVE_ROOT()}?id=${encodeURIComponent(messageId.join(","))}`,
			{},
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async moveMessageToUserFolder(messageId: string | string[], folderId: string): Promise<void> {
		if (!Array.isArray(messageId))
			messageId = [messageId];
		this.checkToken();
		await this.restManager.put(
			CONVERSATION_MOVE_FOLDER(folderId),
			{id: messageId},
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async createDraft(draft: NeoConversationMessageContent, replyToId?: string): Promise<NeoConversationDraftId> {
		this.checkToken();
		return this.restManager.post<NeoConversationDraftId>(
			CONVERSATION_CREATE_DRAFT(replyToId),
			draft,
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async updateDraft(draftId: string, draft: NeoConversationMessageContent): Promise<void> {
		this.checkToken();
		await this.restManager.put<{}>(
			CONVERSATION_UPDATE_DRAFT(draftId),
			draft,
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async sendMessage(content: NeoConversationMessageContent, draftId?: string): Promise<NeoConversationSentMessage> {
		this.checkToken();
		return this.restManager.post<NeoConversationSentMessage>(
			CONVERSATION_SEND_MESSAGE(draftId),
			content,
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async getAvailableRecipients(): Promise<NeoConversationAvailableRecipient> {
		this.checkToken();
		return this.restManager.get<NeoConversationAvailableRecipient>(
			CONVERSATION_VISIBLE(),
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async moveMessageToTrash(messageId: string | string[]): Promise<void> {
		if (!Array.isArray(messageId))
			messageId = [messageId];
		this.checkToken();
		await this.restManager.put<{}>(
			CONVERSATION_TRASH(),
			{id: messageId},
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		)
	}

	public async restoreMessage(messageId: string | string[]): Promise<void> {
		if (!Array.isArray(messageId))
			messageId = [messageId];
		this.checkToken();
		await this.restManager.put<{}>(
			CONVERSATION_RESTORE(),
			{id: messageId},
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		)
	}

	public async deleteMessage(messageId: string | string[]): Promise<void> {
		if (!Array.isArray(messageId))
			messageId = [messageId];
		this.checkToken();
		await this.restManager.put<{}>(
			CONVERSATION_DELETE(),
			{id: messageId},
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		)
	}

	public async addAttachmentToDraft(draftId: string, file: File | Blob | ArrayBuffer, filename?: string): Promise<NeoConversationAttachmentId> {
		this.checkToken();
		return await this.restManager.postFile<NeoConversationAttachmentId>(
			CONVERSATION_MESSAGE_ADD_ATTACHMENT(draftId),
			file,
			{
				"Authorization": `Bearer ${this.credentials.access_token}`
			},
			filename
		);
	}

	public generateAttachmentUrl(messageId: string, attachmentId: string): string {
		return `${this.restManager.getBaseURL()}/${CONVERSATION_MESSAGE_ATTACHMENT(messageId, attachmentId)}`;
	}

	public async deleteAttachmentToDraft(draftId: string, attachmentId: string): Promise<void> {
		this.checkToken();
		await this.restManager.delete<{}>(
			CONVERSATION_MESSAGE_ATTACHMENT(draftId, attachmentId),
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async emptyTrash(): Promise<void> {
		this.checkToken();
		await this.restManager.delete<{}>(
			CONVERSATION_EMPTY_TRASH(),
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		);
	}

	public async markAsRead(messageId: string | string[]): Promise<void> {
		if (!Array.isArray(messageId))
			messageId = [messageId];
		this.checkToken();
		await this.restManager.post<{}>(
			CONVERSATION_TOGGLE_UNREAD(),
			{id: messageId, unread: false},
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		)
	}

	public async markAsUnread(messageId: string | string[]): Promise<void> {
		if (!Array.isArray(messageId))
			messageId = [messageId];
		this.checkToken();
		await this.restManager.post<{}>(
			CONVERSATION_TOGGLE_UNREAD(),
			{id: messageId, unread: true},
			{
				Authorization: `Bearer ${this.credentials.access_token}`
			}
		)
	}
}