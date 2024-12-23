import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
} from "aws-amplify/auth";
import { useEffect, useState } from "react";

export const useUserAttributes = () => {
  const [userAttributes, setUserAttributes] =
    useState<FetchUserAttributesOutput>();
  const [userAttributesLoading, setUserAttributesLoading] = useState(true);

  useEffect(() => {
    setUserAttributesLoading(true);
    fetchUserAttributes()
      .then((userAttributes) => {
        setUserAttributes(userAttributes);
      })
      .finally(() => {
        setUserAttributesLoading(false);
      });
  }, []);

  return {
    userAttributes,
    userAttributesLoading,
  };
};
