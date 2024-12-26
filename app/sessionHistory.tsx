import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { useAppSelector } from "@/redux/hooks";
import { Session } from "@/types/sessions";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Divider, Text } from "react-native-paper";

export default function Index() {
  const router = useRouter();

  const pastSessions = useAppSelector((state) => state.pastSessions);

  const getSessionDate = (session: Session) => {
    return dayjs(session.created_on).format("MMMM D, YYYY");
  };

  const getSessionDuration = (session: Session) => {
    const minutes = dayjs(session.ended_on).diff(session.created_on, "minutes");
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes - hours * 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const openSession = (session: Session) => {
    router.navigate({
      pathname: "/session",
      params: { sessionID: session.id.toString() },
    });
  };

  return (
    <AppView>
      <Text variant="headlineLarge" style={{ textAlign: "center" }}>
        Session History
      </Text>
      <FlatList
        style={{ flex: 1 }}
        ItemSeparatorComponent={() => <Divider style={{ marginVertical: 8 }} />}
        data={pastSessions}
        renderItem={({ item: session }) => (
          <Pressable
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "space-between",
            }}
            onPress={() => openSession(session)}
          >
            <Text>{getSessionDate(session)}</Text>
            <Text>{getSessionDuration(session)}</Text>
          </Pressable>
        )}
      />
      <FooterButtons secondaryLabel="Go back" secondaryAction={router.back} />
    </AppView>
  );
}
