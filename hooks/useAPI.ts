import { useAuthenticator } from "@aws-amplify/ui-react-native";

export const useAPI = () => {
  const { user } = useAuthenticator();
};
