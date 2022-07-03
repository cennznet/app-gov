import type { GenericEvent } from "@cennznet/types";
import { SubmittableResult } from "@cennznet/api";
import { CENNZ_NETWORK } from "@app-gov/service/constants";
import Emittery = require("emittery");

interface EmitEvents {
	txCreated: undefined;
	txHashed: string;
	txSuccessful: SubmittableResult;
	txFailed: SubmittableResult;
	txCancelled: undefined;
}

export class Transaction extends Emittery<EmitEvents> {
	public hash?: string;

	constructor() {
		super();
		this.emit("txCreated");
	}

	setHash(hash: string) {
		const shouldEmit = this.hash !== hash;
		this.hash = hash;
		if (shouldEmit) this.emit("txHashed", hash);
	}

	setResult(result: SubmittableResult) {
		const { status, dispatchError } = result;
		if (!status.isFinalized) return;
		if (dispatchError) return this.emit("txFailed", result);
		return this.emit("txSuccessful", result);
	}

	setCancel() {
		this.emit("txCancelled");
	}

	decodeError(result: SubmittableResult): { code: string; message?: string } {
		const { dispatchError } = result;
		if (!dispatchError?.isModule)
			return { code: "I0E0", message: "Unknown error occurs" };
		const { index, error } = dispatchError.asModule.toJSON();
		const errorMeta = dispatchError.registry.findMetaError(
			dispatchError.asModule
		);
		return {
			code: `I${index}E${error}`,
			message: errorMeta?.docs
				? errorMeta.docs.join(" ")
				: errorMeta?.section && errorMeta?.method
				? `${errorMeta.section}.${errorMeta.method}`
				: undefined,
		};
	}

	findEvent(
		result: SubmittableResult,
		eventSection: string,
		eventMethod: string
	): GenericEvent {
		const { events: records } = result;
		const record = records.find((record) => {
			const event: GenericEvent = record.event;
			return event?.section === eventSection && event?.method === eventMethod;
		});

		return record?.event as GenericEvent;
	}

	findEvents(
		result: SubmittableResult,
		eventSection: string,
		eventMethod: string
	): GenericEvent[] {
		const { events: records } = result;
		return records
			.filter((record) => {
				const event: GenericEvent = record.event;
				return event?.section === eventSection && event?.method === eventMethod;
			})
			.map((record) => record?.event);
	}

	getHashLink(): string {
		return `${CENNZ_NETWORK.ExplorerUrl}/extrinsic/${this?.hash}`;
	}
}
