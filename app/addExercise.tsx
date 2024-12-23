import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { FormItem } from "@/components/FormItem";
import { useAPI } from "@/hooks/useAPI";
import { useAppDispatch } from "@/redux/hooks";
import { addExercise } from "@/redux/slices/exercises";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const apiClient = useAPI();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createExercise = () => {
    setIsLoading(true);
    apiClient
      .post("exercises", { name })
      .then(async (response) => {
        dispatch(addExercise(response));
        router.back();
      })
      .catch((error) => {
        console.error("Failed to create exercise", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AppView>
      <View style={{ alignItems: "center" }}>
        <Text variant="headlineLarge">Add Exercise</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ gap: 24 }}>
          <FormItem label="Name">
            <TextInput value={name} onChangeText={(text) => setName(text)} />
          </FormItem>
        </View>
      </ScrollView>
      <FooterButtons
        primaryLabel="Create"
        primaryAction={createExercise}
        primaryIsLoading={isLoading}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
