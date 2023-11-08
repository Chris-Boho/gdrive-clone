import { useReducer, useEffect } from "react";
import { database } from "../firebase";
import {
  FieldValue,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export type FileType = {
  id: string;
  url: string;
  name: string;
  createdAt: FieldValue;
  folderID: string | null;
  userID: string;
};

export type FolderType = {
  name: string;
  id?: string | null;
  parentID: string | null;
  userID: string | null;
  createdAt?: FieldValue;
  path: PathType[];
};

type RootType = {
  name: string;
  id: string | null;
  parentID: null;
  userID: null;
  path: PathType[];
};

export type PathType = {
  name: string;
  id: string | null;
};

type FolderState = {
  folderID: string | null;
  folder: FolderType | RootType | null;
  childFolders: FolderType[];
  childFiles: FileType[];
};

type Action =
  | {
      type: "SELECT_FOLDER";
      payload: {
        folderID: string | null;
        folder: FolderType | RootType | null;
      };
    }
  | { type: "UPDATE_FOLDER"; payload: { folder: FolderType | RootType | null } }
  | { type: "SET_CHILD_FOLDERS"; payload: { childFolders: FolderType[] } }
  | { type: "SET_CHILD_FILES"; payload: { childFiles: FileType[] } };

const ROOT_FOLDER: RootType = {
  name: "Root",
  id: null,
  parentID: null,
  userID: null,
  path: [],
};

function reducer(state: FolderState, action: Action): FolderState {
  switch (action.type) {
    case "SELECT_FOLDER":
      return {
        folderID: action.payload.folderID,
        folder: action.payload.folder,
        childFolders: [],
        childFiles: [],
      };
    case "UPDATE_FOLDER":
      return {
        ...state,
        folder: action.payload.folder,
      };
    case "SET_CHILD_FOLDERS":
      return {
        ...state,
        childFolders: action.payload.childFolders,
      };
    case "SET_CHILD_FILES":
      return {
        ...state,
        childFiles: action.payload.childFiles,
      };
    default:
      return state;
  }
}

export function useFolder(
  folderID: string | null = null,
  folder: FolderType | null = null
) {
  const initialState: FolderState = {
    folderID,
    folder,
    childFolders: [],
    childFiles: [],
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuth();
  //gets a folder when the folder isn't the root
  const getMyDoc = async () => {
    const docRef = doc(database.folders, folderID as string);
    const docSnap = await getDoc(docRef);
    // console.log("docSnap: ", docSnap.id)
    if (docSnap.exists()) {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: database.formatDoc(docSnap) as FolderType },
      });
      console.log("Document data:", database.formatDoc(docSnap));
    } else {
      console.log("No such document!");
      dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: ROOT_FOLDER },
      });
    }
  };

  useEffect(() => {
    dispatch({ type: "SELECT_FOLDER", payload: { folderID, folder } });
  }, [folderID, folder]);

  useEffect(() => {
    if (folderID == null) {
      return dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: ROOT_FOLDER },
      });
    }
    getMyDoc();
    // console.log("folderID in useFolder: ", folderID)
  }, [folderID]);

  useEffect(() => {
    const q = query(
      database.folders,
      where("parentID", "==", folderID),
      where("userID", "==", currentUser!.uid),
      orderBy("createdAt")
    );
    const listener = onSnapshot(q, (querySnapshot) => {
      let curFolders: FolderType[] = [];
      querySnapshot.docs.forEach((doc) => {
        curFolders.push({ ...(doc.data() as FolderType), id: doc.id });
      });
      dispatch({
        type: "SET_CHILD_FOLDERS",
        payload: {
          childFolders: curFolders,
        },
      });
    });
    return () => listener();
  }, [folderID, currentUser]);

  useEffect(() => {
    const q = query(
      database.files,
      where("folderID", "==", folderID),
      where("userID", "==", currentUser!.uid),
      orderBy("createdAt")
    );
    const listener = onSnapshot(q, (querySnapshot) => {
      let curFiles: FileType[] = [];
      querySnapshot.docs.forEach((doc) => {
        curFiles.push({ ...(doc.data() as FileType), id: doc.id });
      });
      dispatch({
        type: "SET_CHILD_FILES",
        payload: {
          childFiles: curFiles,
        },
      });
    });
    return () => listener();
  }, [folderID, currentUser]);

  return state;
}
