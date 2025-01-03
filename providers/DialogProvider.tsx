import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type DialogOptions = {
  title: string;
  content: string;
  actions: {
    label: string;
    callback: (() => void) | (() => Promise<void>);
    isLoading?: boolean; // Internal use only
  }[];
};

const DialogContext = createContext({
  createDialog: (options: DialogOptions) => {},
});

export const useDialog = () => {
  const { createDialog } = React.useContext(DialogContext);
  return { createDialog };
};

export const DialogProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [activeDialog, setActiveDialog] = useState<DialogOptions | null>(null);

  const createDialog = (options: DialogOptions) => {
    setActiveDialog(options);
  };

  const dismissDialog = () => {
    setActiveDialog(null);
  };

  const setActionLoading = (index: number) => {
    const newActions = [...activeDialog!.actions];
    newActions[index] = {
      ...newActions[index],
      isLoading: true,
    };
    setActiveDialog({ ...activeDialog!, actions: newActions });
  };

  return (
    <DialogContext.Provider value={{ createDialog }}>
      {children}
      <Portal>
        <Dialog
          visible={activeDialog !== null}
          onDismiss={() => dismissDialog()}
        >
          <Dialog.Title>{activeDialog?.title}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{activeDialog?.content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            {activeDialog?.actions.map((action, index) => (
              <Button
                key={index}
                onPress={async () => {
                  setActionLoading(index);
                  await action.callback();
                  dismissDialog();
                }}
                loading={action.isLoading}
              >
                {action.label}
              </Button>
            ))}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </DialogContext.Provider>
  );
};
