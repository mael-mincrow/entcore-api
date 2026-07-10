/** @module RESTManager */
import { RequestOptions } from "~/types/request-handler";
import { MOBILE_HEADERS} from "~/const/headers";
import {NeoInstance} from "~/types/instance";

type QueuedRequest<T> = {
	options: RequestOptions;
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
};

export class NeoRestManager {
	private readonly instance: NeoInstance;
	private queue: QueuedRequest<any>[] = [];
	private requestsSent = 0;
	private readonly MAX_REQUESTS_PER_MINUTE = 100;
	private readonly INTERVAL_MS = 60000;

	constructor(instance: NeoInstance) {
		this.instance = instance;
		setInterval(() => {
			this.requestsSent = 0;
			this.processQueue();
		}, this.INTERVAL_MS);
	}

	private async sendRequest<T>(options: RequestOptions): Promise<T> {
		const { method, path, body, headers } = options;
		const url = `${this.instance.url}/${path}`;

		const response = await fetch(url, {
			method,
			body: body ? (path?.startsWith('auth/') ? new URLSearchParams(body as Record<string, string>) : JSON.stringify(body)) : undefined,
			headers: {
				"Content-Type": `application/${path?.startsWith('auth/') ? "x-www-form-urlencoded" : "json"}`,
				"User-Agent": "@godetremy/entcore-api",
				...MOBILE_HEADERS,
				...headers,
			},
			redirect: "manual",
		});

		if (!response.ok) {
			throw new Error(`${response.status}: ${response.statusText} (Received '${await response.text()}')`);
		}

		const text = await response.text();

		if (text === "")
			return response.headers as T;
		return JSON.parse(text) as T;
	}

	private enqueueRequest<T>(options: RequestOptions): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this.queue.push({ options, resolve, reject });
			this.processQueue();
		});
	}

	private processQueue() {
		while (this.requestsSent < this.MAX_REQUESTS_PER_MINUTE && this.queue.length > 0) {
			const { options, resolve, reject } = this.queue.shift()!;
			this.requestsSent++;
			this.sendRequest<any>(options).then(resolve).catch(reject);
		}
	}

	async get<T>(path: string, headers?: Record<string, string>): Promise<T> {
		return this.enqueueRequest<T>({
			method: "GET",
			path,
			headers
		});
	}

	async post<T>(path: string, body: any, headers?: Record<string, string>): Promise<T> {
		return this.enqueueRequest<T>({
			method: "POST",
			path,
			body,
			headers: headers
		});
	}

	async put<T>(path: string, body: any, headers?: Record<string, string>): Promise<T> {
		return this.enqueueRequest<T>({
			method: "PUT",
			path,
			body,
			headers: headers
		});
	}

	async delete<T>(path: string, headers?: Record<string, string>): Promise<T> {
		return this.enqueueRequest<T>({
			method: "DELETE",
			path: path,
			headers: headers
		});
	}

	async postFile<T>(path: string, file: File | Blob | ArrayBuffer, headers?: Record<string, string>, filename?: string): Promise<T> {
		const url = `${this.instance.url}/${path}`;

		if (file instanceof ArrayBuffer) {
			file = new Blob([file]);
		}

		const upload_filename = filename || (file instanceof File ? file.name : "upload.bin");

		const body = new FormData();
		body.append("file", file, upload_filename);

		const response = await fetch(url, {
			method: "POST",
			body: body,
			headers: {
				"User-Agent": "@godetremy/entcore-api",
				...MOBILE_HEADERS,
				...headers,
			},
			redirect: "manual",
		});

		if (!response.ok) {
			throw new Error(`${response.status}: ${response.statusText} (Received '${await response.text()}')`);
		}

		const text = await response.text();

		if (text === "")
			return response.headers as T;
		return JSON.parse(text) as T;
	}

	getBaseURL(): string {
		return this.instance.url;
	}

	getOauthHeader(): Record<string, string> {
		return {
			client_id: this.instance.oauth_client_id,
			client_secret: this.instance.oauth_client_secret,
		}
	}
}