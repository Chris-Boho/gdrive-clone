import { FolderType } from "../../hooks/useFolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Folder({folder}: {folder: FolderType}) {
  return (
    <Link to={`/folder/${folder.id}`}>  
      <Button variant="outline-dark" className="text-truncate w-100">
          <FontAwesomeIcon icon={faFolder} className="me-2"/>
          {folder.name}
      </Button>
    </Link>
  )
}
