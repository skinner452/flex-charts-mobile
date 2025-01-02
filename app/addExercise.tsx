import { usePostExercises } from "@/api/routes/exercises/usePostExercises";
import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { FormItem } from "@/components/FormItem";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function Index() {
  const router = useRouter();

  const [name, setName] = useState("");

  const postExercise = usePostExercises();

  const createExercise = () => {
    postExercise.mutate({
      name,
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
        primaryIsLoading={postExercise.isPending}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
