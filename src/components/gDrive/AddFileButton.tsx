import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FolderType, FileType } from "../../hooks/useFolder";
import { useAuth } from "../../contexts/AuthContext";
import { storage, database } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, getDocs } from "firebase/firestore";
import { useState } from "react";
import ReactDOM from "react-dom";
import { v4 as uuidv4 } from "uuid";
import { ProgressBar, Toast } from "react-bootstrap";
import {
  doc,
  updateDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

type Props = {
  currentFolder: FolderType | null;
};

type FileUploadType = {
  id: string;
  name: string;
  progress: number;
  error: boolean;
};

export default function AddFileButton({ currentFolder }: Props) {
  const { currentUser } = useAuth();
  const [uploadingFiles, setUploadingFiles] = useState<FileUploadType[]>([]);
  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!currentFolder || !e.target.files || e.target.files.length === 0)
      return;
    const uploadID = uuidv4();
    setUploadingFiles((prevUploadingFiles) => [
      ...prevUploadingFiles,
      { id: uploadID, name: file.name, progress: 0, error: false },
    ]);
    const file = e.target.files[0];
    let filePath = "";
    if (currentFolder.name == "Root") {
      filePath = `${currentFolder.path.join("/")}/${file.name}`;
    } else {
      filePath = `${currentFolder.path.join("/")}/${currentFolder.name}/${
        file.name
      }`;
    }
    const finalPath = `/files/${currentUser?.uid}${filePath}`;
    const filesRef = ref(storage, finalPath);
    const uploadTask = uploadBytesResumable(filesRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot: any) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === uploadID) {
              return { ...uploadFile, progress: progress };
            } else {
              return uploadFile;
            }
          });
        });
      },
      () => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === uploadID) {
              return { ...uploadFile, error: true };
            } else {
              return uploadFile;
            }
          });
        });
      },
      () => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.filter((uploadFile) => {
            return uploadFile.id !== uploadID;
          });
        });
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const tempFile: FileType = {
            id: "",
            url: downloadURL,
            name: file.name,
            createdAt: database.getCurrentTimestamp(),
            folderID: currentFolder.id as string,
            userID: currentUser!.uid,
          };
          const q = query(
            database.files,
            where("name", "==", file.name),
            where("userID", "==", currentUser!.uid),
            where("folderID", "==", currentFolder.id)
          );
          const querySnapshot = await getDocs(q);
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((document) => {
              const docRef = doc(database.files, document.id);
              updateDoc(docRef, { url: downloadURL })
                .then(() => {
                  console.log(
                    "URL updated for document with ID: ",
                    document.id
                  );
                })
                .catch((error) => {
                  console.error(
                    "Error updating URL for document with ID: ",
                    document.id,
                    error
                  );
                });
            });
          } else {
            addDoc(database.files, tempFile)
              .then((docRef) => {
                console.log("File added with ID: ", docRef);
              })
              .catch((error) => {
                console.error("Error adding file: ", error);
              });
          }
        });
      }
    );
  }
  return (
    <>
      <label className="btn btn-outline-success btn-sm me-2">
        <FontAwesomeIcon icon={faFileUpload} />
        {/* we dont want to show the input at all hence the opacity of 0 and left moving to -9999px */}
        {/* the label will access the input */}
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploadingFiles.map((file) => (
              <Toast
                key={file.id}
                onClose={() =>
                  setUploadingFiles((prevUploadingFiles) => {
                    return prevUploadingFiles.filter((uploadFile) => {
                      return uploadFile.id !== file.id;
                    });
                  })
                }
              >
                <Toast.Header
                  closeButton={file.error}
                  className="text-truncate w-100 d-block"
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
