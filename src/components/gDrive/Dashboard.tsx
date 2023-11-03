import { Container } from "react-bootstrap"
import Navbar from "./Navbar"
import AddFolderBtn from "./AddFolderBtn"
import { useFolder } from "../../hooks/useFolder"
import Folder from "./Folder"
import { useParams } from "react-router-dom"
import FolderBreadCrumbs from "./FolderBreadCrumbs"

export default function Dashboard() {
  const { folderID } = useParams()
  const { folder, childFolders } = useFolder(folderID)
  console.log("folder: ", folder?.name)
  console.log("folder.id: ", folder?.id)
  console.log("folderID: ", folderID)

  return (
    <>
      <Navbar/>
      <Container fluid>
        <div className="d-flex align-items-center">
          <FolderBreadCrumbs currentFolder={folder}/>
          <AddFolderBtn currentFolder={folder}/>
        </div>
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map(childfolder => (
              <div key={childfolder.id} style={{maxWidth: "250px"}} className="p-2">
                <Folder folder={childfolder} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
    
  )
}
