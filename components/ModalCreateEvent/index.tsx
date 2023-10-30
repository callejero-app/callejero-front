import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import "./styles.scss";

const App: React.FC<{ open: boolean; updateOpen: Function }> = ({
  // name,
  // updateMessage,
  open,
  updateOpen,
}) => {
  useEffect(() => {
    onOpen();
  }, []);

  const [modalOpen, setModalOpen] = useState(open);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const sendOpen = () => {
    setModalOpen(false);
    updateOpen(false);
  };

  return (
    <>
      {/* <Button onPress={onOpen}>Open Modal</Button> */}
      {/* <Modal isOpen={modalVisible} onOpenChange={onOpenChange}> */}
      <Modal isOpen={modalOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear una reserva
                {/* Title */}
              </ModalHeader>
              <ModalBody>
                <select name="" id="" placeholder="Tipo de Juego">
                  <option value="Juego 1">Tipo de Juego</option>
                  <option value="Juego 1">Juego 2</option>
                  <option value="Juego 1">Juego 3</option>
                </select>
                <p>Fecha: XX-XX-XX</p>
                <select name="" id="" placeholder="Frecuencia (opcional)">
                  <option value="Juego 1">Frecuencia (opcional)</option>
                  <option value="Juego 1">Juego 2</option>
                  <option value="Juego 1">Juego 3</option>
                </select>
                <h2>Participantes</h2>
                <h3>Dinero Abonado</h3>
                <h3>Enviar notificaciones a participantes</h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  // onPress={() => setModalVisible(false)}
                  // onPress={onClose}
                  onPress={sendOpen}
                >
                  Cancelar
                </Button>
                {/* <Button color="primary" onPress={() => setModalVisible(false)}> */}
                <Button color="primary" onPress={onClose}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
