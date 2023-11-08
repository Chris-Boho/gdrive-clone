import { FolderType } from "../../hooks/useFolder";
import { Breadcrumb } from "react-bootstrap";
import { PathType } from "../../hooks/useFolder";
import { Link } from "react-router-dom";

type Props = {
    currentFolder: FolderType | null
  };

export default function FolderBreadCrumbs({currentFolder}: Props) {
  let path: PathType[] = currentFolder?.name === "Root" ? [] : [{name: "Root", id: null}];
  if (currentFolder) path = [...path, ...currentFolder.path]

  return (
    <Breadcrumb className="flex-grow-1" listProps={{className: "bg-red pl-0 m-0"}}>
      {path?.map((folder, index) => (
        <Breadcrumb.Item
        key={folder.id}
        linkAs={Link}
        linkProps={{
          to: {
            pathname: folder.id ? `/folder/${folder.id}` : "/",
            state: {folder: {...folder, path: path.slice(1,index)}}
          }
        }} 
        className="text-truncate d-inline-block"
        style={{maxWidth: "150px"}}
        >
        {folder.name}
        
        </Breadcrumb.Item>
      ))}
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