import React, { useEffect, useState } from "react";

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
import Image from "next/image";
import errorIcon from "@/public/images/circle-xmark-solid.svg";
import successIcon from "@/public/images/circle-check-solid.svg";

const App: React.FC<{
  title: string;
  footer: string;
  type: string;
  updateOpen: Function;
}> = ({ title, footer = "", type, updateOpen }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    onOpen();
    const closeBtn = document.getElementsByClassName(
      "absolute appearance-none select-none top-1 right-1 p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2"
    )[0];
    closeBtn.classList.add("close-btn");
    closeBtn.addEventListener("click", () => close());
    // deleteHoverGray();
  }, []);

  const close = () => {
    setModalOpen(false);
    updateOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={modalOpen}
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
              <ModalBody className="items-center">
                {type == "error" && (
                  <Image
                    src={errorIcon}
                    alt="icon"
                    priority={true}
                    className="w-[5rem]"
                  />
                )}
                {type == "success" && (
                  <Image
                    src={successIcon}
                    alt="icon"
                    priority={true}
                    className="w-[5rem]"
                  />
                )}
                <p className="text-center py-2">{footer}</p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
