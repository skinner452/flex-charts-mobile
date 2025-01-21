import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
} from "aws-amplify/auth";
import { useEffect, useState } from "react";

export const useUserAttributes = () => {
  const [userAttributes, setUserAttributes] =
    useState<FetchUserAttributesOutput>();
  const [userAttributesFetching, setUserAttributesFetching] = useState(true);

  useEffect(() => {
    setUserAttributesFetching(true);
    fetchUserAttributes()
      .then((userAttributes) => {
        setUserAttributes(userAttributes);
      })
      .finally(() => {
        setUserAttributesFetching(false);
      });
  }, []);

  return {
    userAttributes,
    userAttributesFetching,
  };
};
