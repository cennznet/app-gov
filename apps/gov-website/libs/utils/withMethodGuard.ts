import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export function withMethodGuard(handler: NextApiHandler, methods: string[]) {
	return function methodGuardHandler(
		req: NextApiRequest,
		res: NextApiResponse
	) {
		const { method } = req;

		if (!methods.includes(method)) {
			res.setHeader("Allow", methods);
			res.status(405).end(`Method ${method} Not Allowed`);
			return;
		}

		return handler(req, res);
	};
}
