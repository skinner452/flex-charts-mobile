import React, { createContext, PropsWithChildren, useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type DialogOptions = {
  title: string;
  content: string;
  actions: {
    label: string;
    callback?: (() => void) | (() => Promise<void>);
  }[];
};

const DialogContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createDialog: (_options: DialogOptions) => {},
});

export const useDialog = () => {
  const { createDialog } = React.useContext(DialogContext);
  return { createDialog };
};

export const DialogProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [activeDialog, setActiveDialog] = useState<DialogOptions | null>(null);
  const [loadingActionIndex, setLoadingActionIndex] = useState<number | null>(
    null
  );

  const createDialog = (options: DialogOptions) => {
    setLoadingActionIndex(null);
    setActiveDialog(options);
  };

  const dismissDialog = () => {
    setActiveDialog(null);
    setLoadingActionIndex(null);
  };

  const pressAction = async (
    action: DialogOptions["actions"][0],
    index: number
  ) => {
    const result = action.callback?.();

    if (result instanceof Promise) {
      // If the callback result is a promise, show a loading indicator until it resolves
      setLoadingActionIndex(index);
      try {
        await result;
        dismissDialog();
      } catch {
        setLoadingActionIndex(null);
      }
    } else {
      // If the callback is synchronous, dismiss the dialog immediately
      dismissDialog();
    }
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
                onPress={() => pressAction(action, index)}
                loading={loadingActionIndex === index}
                disabled={loadingActionIndex !== null}
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
