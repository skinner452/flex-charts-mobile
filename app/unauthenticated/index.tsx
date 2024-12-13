import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function Unauthenticated() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    console.log("Logging in with:", { username, password });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>login page</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />
      <Button title="Login" onPress={onLogin} />
    </View>
  );
}
