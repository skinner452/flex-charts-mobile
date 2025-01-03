import { useGetSessions } from "@/api/routes/sessions/useGetSessions";
import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { Session } from "@/types/sessions";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { FlatList, Pressable, TouchableHighlight, View } from "react-native";
import { Divider, Text, TouchableRipple } from "react-native-paper";

export default function Index() {
  const router = useRouter();

  const { data: pastSessions } = useGetSessions({ isActive: false });

  const getSessionDate = (session: Session) => {
    return dayjs(session.created_on).format("MMMM D, YYYY");
  };

  const getSessionTime = (time: string) => {
    return dayjs(time).format("h:mm A");
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
        ItemSeparatorComponent={() => <Divider />}
        data={pastSessions}
        renderItem={({ item: session }) => (
          <TouchableRipple onPress={() => openSession(session)}>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "space-between",
                padding: 16,
              }}
            >
              <Text>{getSessionDate(session)}</Text>
              <Text>
                {getSessionTime(session.created_on)} -{" "}
                {getSessionTime(session.ended_on ?? "")}
              </Text>
            </View>
          </TouchableRipple>
        )}
      />
      <FooterButtons secondaryLabel="Go back" secondaryAction={router.back} />
    </AppView>
  );
}
