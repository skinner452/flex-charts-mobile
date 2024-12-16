import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
} from "aws-amplify/auth";
import { useEffect, useState } from "react";

export const useUserAttributes = () => {
  const [attributes, setAttributes] = useState<FetchUserAttributesOutput>();

  useEffect(() => {
    fetchUserAttributes().then((attributes) => {
      setAttributes(attributes);
    });
  }, []);

  return attributes;
};
