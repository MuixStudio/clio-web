import { Registration } from "@ory/elements-react/theme";
import { OryPageParams } from "@ory/nextjs/app";

import { getRegistrationFlow } from "../sdk/registration";

import config from "@/ory.config";

export default async function RegistrationPage(props: OryPageParams) {
  const flow = await getRegistrationFlow(config, props.searchParams);

  if (!flow) {
    return null;
  }

  return <Registration config={config} flow={flow} />;
}
