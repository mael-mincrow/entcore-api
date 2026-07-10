import {NeoConversationListParameters} from "~/types/conversation";
import {generateParametersConversationList} from "~/rest/parameters";

export const AUTH_TOKEN = () => "auth/oauth2/token";
export const AUTH_USERINFO = () => "auth/oauth2/userinfo";
export const AUTH_WELCOME = (token: string) => `/welcome?queryparam_token=${token}`;

export const SSO_PRONOTE = () => "sso/pronote";

export const CONVERSATION_BASE_URL = () => "conversation";
export const CONVERSATION_FOLDERS = () => `${CONVERSATION_BASE_URL()}/api/folders`;
export const CONVERSATION_FOLDER = () => `${CONVERSATION_BASE_URL()}/folder`;
export const CONVERSATION_MOVE_FOLDER = (folderId: string) => `${CONVERSATION_BASE_URL()}/move/userfolder/${folderId}`;
export const CONVERSATION_MOVE_ROOT = () => `${CONVERSATION_BASE_URL()}/move/root`;
export const CONVERSATION_FOLDERS_DELETE = (id: string) => `${CONVERSATION_BASE_URL()}/api/folders/${id}`;
export const CONVERSATION_FOLDER_MESSAGES = (id: string, param: NeoConversationListParameters) => `${CONVERSATION_BASE_URL()}/api/folders/${encodeURIComponent(id)}/messages${generateParametersConversationList(param)}`;
export const CONVERSATION_CREATE_DRAFT = (replyToId?: string) => `${CONVERSATION_BASE_URL()}/draft${replyToId ? `?In-Reply-To=${replyToId}` : ""}`;
export const CONVERSATION_UPDATE_DRAFT = (id: string) => `${CONVERSATION_BASE_URL()}/draft/${id}`;
export const CONVERSATION_SEND_MESSAGE = (draftId?: string) => `${CONVERSATION_BASE_URL()}/send${draftId ? `?id=${draftId}` : ""}`;
export const CONVERSATION_TRASH = () => `${CONVERSATION_BASE_URL()}/trash`;
export const CONVERSATION_RESTORE = () => `${CONVERSATION_BASE_URL()}/restore`;
export const CONVERSATION_DELETE = () => `${CONVERSATION_BASE_URL()}/delete`;
export const CONVERSATION_MESSAGE_ADD_ATTACHMENT = (draftId: string) => `${CONVERSATION_BASE_URL()}/message/${draftId}/attachment`;
export const CONVERSATION_EMPTY_TRASH = () => `${CONVERSATION_BASE_URL()}/emptyTrash`;
export const CONVERSATION_MESSAGE_ATTACHMENT = (messageId: string, attachmentId: string) => `${CONVERSATION_BASE_URL()}/message/${messageId}/attachment/${attachmentId}`;
export const CONVERSATION_MESSAGE = (messageId: string) => `${CONVERSATION_BASE_URL()}/api/messages/${messageId}`;
export const CONVERSATION_TOGGLE_UNREAD = () => `${CONVERSATION_BASE_URL()}/toggleUnread`;
export const CONVERSATION_VISIBLE = () => `${CONVERSATION_BASE_URL()}/visible`;

export const MEDIACENTRE_BASE_URL = () => "mediacentre";
export const MEDIACENTRE_SEARCH = (jsondata: string) => `${MEDIACENTRE_BASE_URL()}/search?jsondata=${encodeURIComponent(jsondata)}`;

export const USERBOOK_BASE_URL = () => "userbook";
export const USERBOOK_AVATAR = (userId: string) => `${USERBOOK_BASE_URL()}/avatar/${userId}`;

export const CAS_OAUTH_LOGIN = (service: string) => `cas/oauth/login?service=${encodeURIComponent(service)}`;