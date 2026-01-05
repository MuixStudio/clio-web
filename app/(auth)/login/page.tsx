import { Login } from "@ory/elements-react/theme";
import { OryPageParams } from "@ory/nextjs/app";

import { getLoginFlow } from "../sdk/login";

import config from "@/ory.config";
import { CustomComponents } from "@/components/kratos";

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(config, props.searchParams);

  if (!flow) {
    return null;
  }

  return <Login components={CustomComponents} config={config} flow={flow} />;
}
