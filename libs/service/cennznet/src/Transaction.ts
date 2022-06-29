import type { GenericEvent } from "@cennznet/types";
import { SubmittableResult } from "@cennznet/api";
import { CENNZ_NETWORK } from "@app-gov/service/constants";

const Emittery = require("emittery");

interface EmitEvents {
	txCreated: undefined;
	txHashed: string;
	txSucceeded: SubmittableResult;
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

		if (status.isFinalized && !dispatchError)
			return this.emit("txSucceeded", result);

		if (status.isFinalized && dispatchError)
			return this.emit("txFailed", result);
	}

	setCancel() {
		this.emit("txCancelled");
	}

	decodeError(result: SubmittableResult): string | void {
		const { dispatchError } = result;
		if (!dispatchError?.isModule) return;
		const { index, error } = dispatchError.asModule.toJSON();
		const errorMeta = dispatchError.registry.findMetaError(
			new Uint8Array([index as number, error as number])
		);
		return errorMeta?.section && errorMeta?.method
			? `${errorMeta.section}.${errorMeta.method}`
			: `I${index}E${error}`;
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
