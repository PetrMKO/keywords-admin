import React, {useEffect, useState} from 'react';
import {Select, TextField} from "@mui/material";
import {Keyword} from "../EntityViewer/entityTypes";
import Loader from "../Loader";
import axios from "axios";

type KeywordEditorProps = {
  id: number
}

const KeywordEditor = ({id}:KeywordEditorProps) => {
  const [keyword, setKeyword] = useState<Keyword | null>(null)
  const [requestError, setRequestError] = useState<any>()

  useEffect(()=>{
    console.log('render')

    const getKeywords = async () =>{
      axios.get<Keyword>(`https://api.profiling.track.itmo.su/keywords/${id}`).then(({data})=>{
        setKeyword(data)
      }).catch(setRequestError)
    }

    getKeywords()

  }, [id])

  if(requestError)
    return requestError.toString()

  return (
      keyword
        ? <>
          <TextField size={'small'} value={keyword.text}/>
          <Select  size={'small'}/>
          <Select  size={'small'}/>
        </>
        : <Loader height={'300px'}/>
  );
};

export default KeywordEditor;
