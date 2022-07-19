import { GetStaticProps, NextPage } from "next";

import { resolveProposalJustification } from "@app-gov/node/utils";
import { MONGODB_URI } from "@app-gov/service/env-vars";
import { getMongoClient, ProposalModel } from "@app-gov/service/mongodb";
import { Header, Layout, ProposalBody } from "@app-gov/web/components";

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
		.findOne({ proposalId: pid })
		.lean();

	const justification = await resolveProposalJustification(
		proposal.justificationUri
	);

	if (!proposal)
		return {
			notFound: true,
		};

	return {
		props: {
			proposal: {
				...proposal,
				_id: proposal._id.toString(),
			},
			justification,
		},
		revalidate: 600,
	};
};

interface ProposalProps {
	proposal: ProposalModel;
	justification: string;
}

const Proposal: NextPage<ProposalProps> = ({ proposal, justification }) => {
	const { proposalId, call } = proposal;

	console.log(call);

	return (
		<Layout.PageWrapper>
			<Header />
			<Layout.PageContent className="max-w-4xl lg:max-w-5xl">
				<Layout.PageHeader>Proposal #{proposalId}</Layout.PageHeader>
				<div>
					<ProposalBody.Justification justification={justification} />
					<ProposalBody.Call call={call} />
				</div>
			</Layout.PageContent>
		</Layout.PageWrapper>
	);
};

export default Proposal;
