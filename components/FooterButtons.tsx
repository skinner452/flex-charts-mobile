import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";

type Props = {
  primaryLabel?: string;
  primaryAction?: () => void;
  primaryIsLoading?: boolean;

  secondaryLabel?: string;
  secondaryAction?: () => void;
};

export const FooterButtons = (props: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 16,
      }}
    >
      {props.secondaryLabel ? (
        <View style={{ flex: 1 }}>
          <Button mode="elevated" onPress={() => props.secondaryAction?.()}>
            Go back
          </Button>
        </View>
      ) : null}

      {props.primaryLabel ? (
        <View style={{ flex: 1 }}>
          <Button
            mode="contained"
            onPress={() => props.primaryAction?.()}
            loading={props.primaryIsLoading}
            disabled={props.primaryIsLoading}
          >
            {props.primaryLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
};
