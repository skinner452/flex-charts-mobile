import { usePostExercises } from "@/api/routes/exercises/usePostExercises";
import { AppView } from "@/components/AppView";
import { ExerciseType } from "@/components/ExerciseType";
import { FooterButtons } from "@/components/FooterButtons";
import { FormItem } from "@/components/FormItem";
import { useValidation, ValidationFields } from "@/hooks/useValidation";
import { ExerciseTypeID } from "@/types/exercise_types";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

export default function Index() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [typeID, setTypeID] = useState<ExerciseTypeID>(ExerciseTypeID.STRENGTH);

  const validationFields = useMemo(() => {
    return {
      name: {
        value: name,
        isRequired: true,
        type: "string",
        maxLength: 50,
      },
    } as ValidationFields;
  }, [name]);
  const { fieldErrors, isValid } = useValidation(validationFields);

  const { mutateAsync: createExerciseAsync, isPending: isCreatingExercise } =
    usePostExercises({
      onSuccess: (newExercise) => {
        router.back();
        router.setParams({ newExerciseID: newExercise.id });
      },
    });

  const createExercise = async () => {
    await createExerciseAsync({
      name,
      exercise_type_id: typeID,
    });
  };

  return (
    <AppView>
      <View style={{ alignItems: "center" }}>
        <Text variant="headlineLarge">Add Exercise</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ gap: 24 }}>
          <FormItem label="Name" error={fieldErrors["name"]}>
            <TextInput value={name} onChangeText={(text) => setName(text)} />
          </FormItem>
          <FormItem label="Type">
            {[
              {
                id: ExerciseTypeID.STRENGTH,
                name: "Strength",
                description:
                  "Weight machines, free weights, body weight exercises",
                icon: "arm-flex",
              },
              {
                id: ExerciseTypeID.CARDIO,
                name: "Cardio",
                description: "Treadmills, ellipticals, bikes",
                icon: "run-fast",
              },
            ].map((type) => (
              <ExerciseType
                {...type}
                key={type.id}
                selected={type.id === typeID}
                onPress={() => setTypeID(type.id)}
              />
            ))}
          </FormItem>
        </View>
      </ScrollView>
      <FooterButtons
        primaryLabel="Create"
        primaryAction={() => createExercise()}
        primaryIsLoading={isCreatingExercise}
        primaryDisabled={!isValid}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
