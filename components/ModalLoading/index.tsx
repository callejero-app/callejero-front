import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";

const App: React.FC<{ title: string; footer: string }> = ({
  title,
  footer,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Modal
        isOpen={true}
        onOpenChange={onOpenChange}
        isDismissable={false}
        closeButton={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                {title}
              </ModalHeader>
              <ModalBody>
                <Spinner className="circle1" size="lg" color="primary" />
                <p className="text-center">{footer}</p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
