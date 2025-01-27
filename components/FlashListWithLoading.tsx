import React from "react";

import { FlashList, FlashListProps } from "@shopify/flash-list";
import { ActivityIndicator } from "react-native-paper";

type Props<T> = { isLoading: boolean } & FlashListProps<T>;

export const FlashListWithLoading = <T,>(props: Props<T>) => (
  <FlashList
    {...props}
    ListHeaderComponent={props.isLoading ? <ActivityIndicator /> : null}
  />
);
