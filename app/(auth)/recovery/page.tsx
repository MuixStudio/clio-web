import { Recovery } from "@ory/elements-react/theme";
import { OryPageParams } from "@ory/nextjs/app";

import { getRecoveryFlow } from "../sdk/recovery";

import config from "@/ory.config";

export default async function RecoveryPage(props: OryPageParams) {
  const flow = await getRecoveryFlow(config, props.searchParams);

  if (!flow) {
    return null;
  }

  return <Recovery config={config} flow={flow} />;
}
