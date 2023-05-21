export const revalidateProposalRoute = async (
	proposalId: number,
	websiteUrl: string,
	secret: string
) => {
	const res = await fetch(
		`${websiteUrl}/api/revalidate/${proposalId}&secret=${secret}`,
		{
			method: "GET",
		}
	);

	return await res.json();
};
