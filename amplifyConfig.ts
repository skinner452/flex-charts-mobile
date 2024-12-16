import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.COGNITO_POOL_ID || "",
      userPoolClientId: process.env.COGNITO_CLIENT_ID || "",
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
});
