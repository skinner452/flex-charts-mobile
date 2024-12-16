import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_COGNITO_POOL_ID || "",
      userPoolClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID || "",
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
});
