enum NeoConversationSystemFolder {
	INBOX = 'inbox',
	OUTBOX = 'outbox',
	DRAFT = 'draft',
	TRASH = 'trash'
}

enum NeoConversationRecipientType {
	USER = 'User',
	GROUP = 'Group',
	SHARE_BOOKMARK = 'ShareBookmark',
	BROADCAST_GROUP = 'BroadcastGroup',
}

enum NeoConversationMessageState {
	DRAFT = 'DRAFT',
	SENT = 'SENT',
	RECALL = 'RECALL',
}

interface NeoConversationAttachment {
	id: string;
	charset: string;
	contentTransferEncoding: string;
	contentType: string;
	filename: string;
	name: string;
	size: number;
}

interface NeoConversationFolder {
	id: string;
	parent_id?: string;
	name: string;
	depth: number;
	subFolders?: NeoConversationFolder[];
	nbMessages: number;
	nbUnread: number;
}

interface NeoConversationGroup {
	id: string;
	displayName: string;
	size?: number;
	type?: string;
	subType?: string;
}

interface NeoConversationMessageInformation {
	id: string;
	date?: number;
	subject: string;
	from?: NeoConversationUser;
	to: NeoConversationRecipients;
	cc: NeoConversationRecipients;
	cci?: NeoConversationRecipients;
	state?: NeoConversationMessageState;
	unread?: boolean;
	trashed?: boolean;
	response?: boolean;
	forwarded?: boolean;
}

interface NeoConversationMessageMetadata extends NeoConversationMessageInformation {
	hasAttachment: boolean;
	count: number;
}

interface NeoConversationMessage extends NeoConversationMessageMetadata {
	attachments: NeoConversationAttachment[];
	body: string;
	language?: string;
	folder_id?: string;
	parent_id?: string;
	thread_id?: string;
	original_format_exists: boolean;
}

interface NeoConversationSentMessage {
	id: string;
	subject: string;
	body: string;
	thread_id: string;
	/** Number of reached recipients. */
	sent: number;
	/** IDs of unreachable recipients. */
	undelivered: [];
	/** IDs of inactive recipients. */
	inactive: string[];
}

interface NeoConversationRecipients {
	users: NeoConversationUser[];
	groups: NeoConversationGroup[];
}

interface NeoConversationRecipientIds {
	users: string[];
	groups: string[];
}

interface NeoConversationSignaturePreferences {
	useSignature?: boolean;
	signature?: string;
}

interface NeoConversationUser {
	id: string;
	displayName: string;
	profile: string;
}

interface NeoConversationRecipientBase {
	id: string;
	profile?: string;
	nbUsers?: number;
	structureName?: string;
	groupType?: string;
	usedIn: ('TO' | 'CC' | 'CCI')[];
	type: NeoConversationRecipientType;
	children?: { id: string; displayName: string }[];
	relatives?: { id: string; displayName: string }[];
}

interface NeoConversationRecipient extends NeoConversationRecipientBase {
	displayName: string;
}

interface NeoConversationRecipientGroup extends NeoConversationRecipientBase {
	name: string;
	groupDisplayName?: string;
}

interface NeoConversationAvailableRecipient {
	groups: NeoConversationRecipientGroup[];
	users: NeoConversationRecipient[];
}

interface NeoConversationListParameters {
	unread?: boolean;
	page?: number;
	page_size?: number;
	search?: string;
}

interface NeoConversationMessageContent {
	to: string[];
	cc?: string[];
	cci?: string[];
	subject?: string;
	body?: string;
}

interface NeoConversationDraftId {
	id: string;
}

interface NeoConversationAttachmentId {
	id: string;
}

interface NeoConversationFolderId {
	id: string;
}

export type {
	NeoConversationAttachment,
	NeoConversationFolder,
	NeoConversationGroup,
	NeoConversationMessageInformation,
	NeoConversationMessageMetadata,
	NeoConversationMessage,
	NeoConversationSentMessage,
	NeoConversationRecipients,
	NeoConversationRecipientIds,
	NeoConversationSignaturePreferences,
	NeoConversationUser,
	NeoConversationRecipient,
	NeoConversationAvailableRecipient,
	NeoConversationListParameters,
	NeoConversationMessageContent,
	NeoConversationDraftId,
	NeoConversationAttachmentId,
	NeoConversationFolderId,
}
export {
	NeoConversationSystemFolder,
	NeoConversationRecipientType,
	NeoConversationMessageState
}