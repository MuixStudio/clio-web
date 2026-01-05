"use client";
import { getNodeLabel } from "@ory/client-fetch";
import { OryNodeButtonProps } from "@ory/elements-react";
import { useMemo } from "react";
export const MyCustomButton = ({
  node,
  attributes,
}: OryNodeButtonProps) => {
  const label = getNodeLabel(node);

  const isPrimary = useMemo(() => {
    return (
      attributes.name === "method" ||
      attributes.name.includes("passkey") ||
      attributes.name.includes("webauthn") ||
      attributes.name.includes("lookup_secret") ||
      (attributes.name.includes("action") && attributes.value === "accept")
    );
  }, [attributes.name, attributes.value]);

  return (
    <button
      className={
        "bg-blue-500 text-white p-2 rounded-md " + (isPrimary && "bg-red-600")
      }
    >
      {attributes.type.includes("submit") ? (
        <span>Submitting...</span>
      ) : label ? (
        <span>{label.text}</span>
      ) : (
        ""
      )}
    </button>
  );
};
