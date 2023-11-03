import { useReducer, useEffect } from 'react';
import { database } from '../firebase';
import { FieldValue, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export type FolderType = {
  name: string,
  id?: string | null,
  parentID: string | null,
  userID: string | null,
  createdAt?: FieldValue,
}

type RootType = {
  name: string,
  id: null,
  parentID: null,
  userID: null,
  path: []
}

type FolderState = {
  folderID: string | null;
  folder: FolderType | RootType | null;
  childFolders: FolderType[];
  childFiles: FolderType[]; 
};

type Action =
  | { type: 'SELECT_FOLDER'; payload: { folderID: string | null; folder: FolderType | RootType |null } }
  | { type: 'UPDATE_FOLDER'; payload: { folder: FolderType | RootType | null } }
  | { type: 'SET_CHILD_FOLDERS'; payload: { childFolders: FolderType[] } }

const ROOT_FOLDER: RootType = {
  name: "Root",
  id: null,
  parentID: null,
  userID: null, 
  path: [],
}

function reducer(state: FolderState, action: Action): FolderState {
  switch (action.type) {
    case 'SELECT_FOLDER':
      return {
        folderID: action.payload.folderID,
        folder: action.payload.folder,
        childFolders: [],
        childFiles: [],
      }
    case 'UPDATE_FOLDER':
      return {
        ...state,
        folder: action.payload.folder
      }
    case 'SET_CHILD_FOLDERS':
      return {
        ...state,
        childFolders: action.payload.childFolders
      }
    default:
      return state;
  }
}

export function useFolder(folderID: string | null = null, folder: FolderType | null = null) {
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
    const docRef = doc(database.folders, folderID as string)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: database.formatDoc(docSnap) as FolderType }
      })
      console.log("Document data:", database.formatDoc(docSnap));
    } else {
      console.log("No such document!");
      dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: ROOT_FOLDER}
      })
    }
  }

  useEffect(() => {
    dispatch({type: 'SELECT_FOLDER', payload: {folderID, folder}})
  }, [folderID, folder])

  useEffect(() => {
    if (folderID == null){
      return dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: ROOT_FOLDER}
      })
    }
    getMyDoc()
  }, [folderID])

  useEffect(() => {
    const q = query(database.folders, 
      where("parentID", "==", folderID),
      where("userID", "==", currentUser!.uid),
      orderBy("createdAt"))
    
      const listener = onSnapshot(q, querySnapshot => {
        let curfolders: FolderType[] = [];
        querySnapshot.docs.forEach((doc) => {
          curfolders.push({...doc.data() as FolderType, id: doc.id})
        })
        dispatch({
          type: "SET_CHILD_FOLDERS",
          payload: {
            childFolders: curfolders
          }
        })
      })
      return () => listener()
  }, [folderID, currentUser])

  console.log("childFolders: ",state.childFolders)
  return state
}
