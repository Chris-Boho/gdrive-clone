import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { database } from "../../firebase";
import { addDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { FolderType } from "../../hooks/useFolder";

type Props = {
  currentFolder: FolderType | null;
};

export default function AddFolderBtn({ currentFolder }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { currentUser } = useAuth();

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const path = currentFolder!.path;
    console.log("currentFolder_PATH: ", currentFolder!.path);

    if (currentFolder !== null) {
      if (currentFolder.name !== "Root") {
        path.push(
          currentFolder.id
            ? { name: currentFolder.name, id: currentFolder.id }
            : { name: currentFolder.name, id: null }
        );
      }
    }

    console.log("currentFID: ", currentFolder!.id);
    const tempFolder: FolderType = {
      name: name,
      parentID: currentFolder!.id as string,
      userID: currentUser!.uid,
      createdAt: database.getCurrentTimestamp(),
      path: path,
    };
    await addDoc(database.folders, tempFolder)
      .then((docRef) => {
        console.log("Folder added with ID: ", docRef);
      })
      .catch((error) => {
        console.error("Error adding folder: ", error);
      });

    setName("");
    closeModal();
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
