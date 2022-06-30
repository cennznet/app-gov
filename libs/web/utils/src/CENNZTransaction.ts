import { SubmittableResult } from "@cennznet/api";
import Emittery from "emittery";
import { CENNZ_NETWORK } from "@app-gov/node/constants";
import { CENNZEvent } from "@app-gov/web/types";

interface EmitEvents {
	txCreated: undefined;
	txHashed: string;
	txSucceeded: SubmittableResult;
	txFailed: SubmittableResult;
	txCancelled: undefined;
}

export class CENNZTransaction extends Emittery<EmitEvents> {
	public hash: string | undefined;

	constructor() {
		super();
		this.emit("txCreated");
	}

	setHash(hash: string): void {
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

	decodeError(result: SubmittableResult): string | undefined {
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
	): CENNZEvent | undefined {
		const { events: records } = result;
		const record = records.find((record) => {
			const event: CENNZEvent = record.event;
			return event?.section === eventSection && event?.method === eventMethod;
		});

		return record?.event;
	}

	findEvents(
		result: SubmittableResult,
		eventSection: string,
		eventMethod: string
	): CENNZEvent[] {
		const { events: records } = result;
		return records
			.filter((record) => {
				const event: CENNZEvent = record.event;
				return event?.section === eventSection && event?.method === eventMethod;
			})
			.map((record) => record?.event);
	}

	getHashLink(): string {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return `${CENNZ_NETWORK!.ExplorerUrl}/extrinsic/${this?.hash}`;
	}
}
