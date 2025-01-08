import { useGetExercises } from "@/api/routes/exercises/useGetExercises";
import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import { Divider, Text, TouchableRipple } from "react-native-paper";

export default function Index() {
  const router = useRouter();

  const { data: exercises } = useGetExercises();

  return (
    <AppView>
      <Text variant="headlineLarge" style={{ textAlign: "center" }}>
        Exercises
      </Text>

      <FlatList
        data={exercises}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item: exercise }) => (
          <TouchableRipple>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "space-between",
                padding: 16,
              }}
            >
              <Text>{exercise.name}</Text>
            </View>
          </TouchableRipple>
        )}
      />

      <FooterButtons secondaryLabel="Go back" secondaryAction={router.back} />
    </AppView>
  );
}
