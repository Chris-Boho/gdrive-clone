import { Container } from "react-bootstrap";
import Navbar from "./Navbar";
import AddFolderBtn from "./AddFolderBtn";
import AddFileButton from "./AddFileButton";
import { useFolder } from "../../hooks/useFolder";
import Folder from "./Folder";
import File from "./File";
import { useParams } from "react-router-dom";
import FolderBreadCrumbs from "./FolderBreadCrumbs";

export default function Dashboard() {
  const { folderID } = useParams();
  const { folder, childFolders, childFiles } = useFolder(folderID);

  return (
    <>
      <Navbar />
      <Container fluid>
        <div className="d-flex align-items-center">
          <FolderBreadCrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
          <AddFolderBtn currentFolder={folder} />
        </div>
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map((childfolder) => (
              <div
                key={childfolder.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <Folder folder={childfolder} />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFolders.length > 0 || (childFiles.length > 0 && <hr />)}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map((childFile) => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
