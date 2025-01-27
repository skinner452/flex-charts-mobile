import React from "react";

import { useDeleteExercisesId } from "@/api/routes/exercises/useDeleteExercisesId";
import { useGetExercisesId } from "@/api/routes/exercises/useGetExercisesId";
import { usePutExercisesId } from "@/api/routes/exercises/usePutExercisesId";
import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { FormItem } from "@/components/FormItem";
import { useValidation, ValidationFields } from "@/hooks/useValidation";
import { useDialog } from "@/providers/DialogProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const { createDialog } = useDialog();
  const theme = useTheme();

  const { exerciseID } = useLocalSearchParams<{
    exerciseID: string;
  }>();

  const [name, setName] = useState("");
  const [dataInitialized, setDataInitialized] = useState(false);

  const { data: apiData } = useGetExercisesId(parseInt(exerciseID));

  const { mutateAsync: updateExerciseAsync, isPending: isUpdatingExercise } =
    usePutExercisesId(parseInt(exerciseID), {
      onSuccess: () => {
        router.back();
      },
    });

  const updateExercise = async () => {
    await updateExerciseAsync({
      name,
    });
  };

  const { mutateAsync: deleteExerciseAsync, isPending: isDeletingExercise } =
    useDeleteExercisesId(parseInt(exerciseID), {
      onSuccess: () => {
        // Go back twice to avoid the user landing on the deleted exercise
        router.back();
        router.back();
      },
      onError: (error) => {
        console.error(error);
      },
    });

  useEffect(() => {
    // If this is the first data fetch, set the inputs
    if (apiData && !dataInitialized) {
      setName(apiData.name);
      setDataInitialized(true);
    }
  }, [apiData, dataInitialized]);

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

  const promptDelete = useCallback(() => {
    createDialog({
      title: "Delete exercise",
      content:
        "Are you sure you want to delete this exercise? This will also delete all associated workout data.",
      actions: [
        {
          label: "Cancel",
        },
        {
          label: "Delete",
          callback: async () => {
            await deleteExerciseAsync();
          },
        },
      ],
    });
  }, [createDialog, deleteExerciseAsync]);

  return (
    <AppView>
      <View style={{ alignItems: "center" }}>
        <Text variant="headlineLarge">Update Exercise</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ gap: 24 }}>
          <FormItem label="Name" error={fieldErrors["name"]}>
            <TextInput value={name} onChangeText={(text) => setName(text)} />
          </FormItem>

          <Button textColor={theme.colors.error} onPress={() => promptDelete()}>
            Delete
          </Button>
        </View>
      </ScrollView>
      <FooterButtons
        primaryLabel="Save"
        primaryAction={() => updateExercise()}
        primaryIsLoading={isUpdatingExercise || isDeletingExercise}
        primaryDisabled={!isValid}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
