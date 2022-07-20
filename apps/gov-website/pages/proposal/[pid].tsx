import { GetStaticProps, NextPage } from "next";

import { resolveProposalJustification } from "@app-gov/node/utils";
import { MONGODB_URI } from "@app-gov/service/env-vars";
import { getMongoClient, ProposalModel } from "@app-gov/service/mongodb";
import { Header, Layout } from "@app-gov/web/components";

export const getStaticPaths = async () => {
	const mdb = await getMongoClient(MONGODB_URI);
	const proposals = await mdb
		.model<ProposalModel>("Proposal")
		.find()
		.sort("-proposalId");

	return {
		paths: proposals.map((proposal) => ({
			params: { pid: proposal.proposalId.toString() },
		})),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const {
		params: { pid },
	} = context;
	const mdb = await getMongoClient(MONGODB_URI);
	const proposal = await mdb
		.model<ProposalModel>("Proposal")
		.findOne({ proposalId: pid });

	const justification = await resolveProposalJustification(
		proposal.justificationUri
	);

	if (!proposal || !justification)
		return {
			notFound: true,
		};

	return {
		props: {
			proposal: {
				proposalId: proposal.proposalId,
			},
		},
		revalidate: 600,
	};
};

interface ProposalProps {
	proposal: ProposalModel;
}

const Proposal: NextPage<ProposalProps> = ({ proposal }) => {
	const { proposalId } = proposal;

	return (
		<Layout.PageWrapper>
			<Header />
			<Layout.PageContent>
				<Layout.PageHeader>Proposal #{proposalId}</Layout.PageHeader>
			</Layout.PageContent>
		</Layout.PageWrapper>
	);
};

export default Proposal;
