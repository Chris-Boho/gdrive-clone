import { FolderType } from "../../hooks/useFolder";
import { Breadcrumb } from "react-bootstrap";

type Props = {
    currentFolder: FolderType | null
  };

export default function FolderBreadCrumbs({currentFolder}: Props) {
  console.log("currentFolderPath: ",currentFolder?.path)
  return (
    <Breadcrumb className="flex-grow-1" listProps={{className: "bg-red pl-0 m-0"}}>
        {currentFolder && (
        <Breadcrumb.Item 
            className="text-truncate d-inline-block"
            style={{maxWidth: "200px"}}
            active
        >
            {currentFolder.name}
            
        </Breadcrumb.Item>
        )}
    </Breadcrumb>
  )
}