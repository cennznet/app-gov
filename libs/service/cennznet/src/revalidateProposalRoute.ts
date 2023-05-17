export const revalidateProposalRoute = async (
	proposalId: number,
	secret: string
) => {
	const res = await fetch(`/api/revalidate/${proposalId}&secret=${secret}`, {
		method: "GET",
	});

	return await res.json();
};
