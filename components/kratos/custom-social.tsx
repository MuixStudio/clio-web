import { OryNodeSsoButtonProps } from "@ory/elements-react";
import { RectangleGoggles } from "lucide-react";

const Icons: Record<string, any> = {
  google: RectangleGoggles,
};

export function MyCustomSsoButton({ node, attributes }: OryNodeSsoButtonProps) {
  const Icon = Icons[attributes.value] || RectangleGoggles;

  return (
    <button className="p-2 rounded-md bg-gray-100">
      <span className="flex items-center gap-2 justify-center">
        {attributes.type.includes("submit") ? (
          <>
            <Icon />
            {node.meta.label?.text}
          </>
        ) : (
          <span>Submitting...</span>
        )}
      </span>
    </button>
  );
}
