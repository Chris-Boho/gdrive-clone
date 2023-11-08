import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileType } from "../../hooks/useFolder";
import { faFile } from "@fortawesome/free-solid-svg-icons";

type Props = {
  file: FileType;
};

export default function File({ file }: Props) {
  return (
    <a
      href={file.url}
      target="_blank"
      className="btn btn-outline-dark text-truncate w-100"
    >
      <FontAwesomeIcon icon={faFile} className="me-2" />
      {file.name}
    </a>
  );
}
