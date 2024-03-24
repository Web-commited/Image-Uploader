import React, { Fragment ,useState} from 'react'
import Message from './Message'
import Progress from './Progress'
import axios from '../request/axios'



export default function imageUpload() {
  const [message,setMessage]=useState('')
  const [uploadPercentage,setUploadPercentage]=useState(0)
  const [file,setFile]=useState('')
  const [uploadedFile,setUploadedFile]=useState({})
  
  
  const handleSubmit=async (e)=> {
    e.preventDefault();
    const formData=new FormData()
    formData.append('file',file)
    try{
      const res=await axios.post('upload',formData,{
        onUploadProgress:(ProgressEvent)=>{
          setUploadPercentage(
            parseInt(
              Math.round((ProgressEvent.loaded*100)/ProgressEvent.total)
            )
          )
        }
      })
      setTimeout(()=>setUploadPercentage(0),5000)
      setMessage('File Uploaded')
      const {fileName,filePath}=res.data
      setUploadedFile({fileName,filePath})
    }catch(error){
      console.log('error')
      if(error.response.status===500){
        setMessage('There was a problem with the server')
      }
    }
  }


  const onChange=(e)=>{
    if(e.target.files.length){
      setFile(e.target.files[0])
    }
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit} method='post' encType='multipart/form-data'>
        {message&& <Message message={message} setMessage={setMessage}/>}
        <div className='input-group mb-3'>
          <input type="file" className='form-control' onChange={onChange}/>
        </div>
        <Progress percentage={uploadPercentage}/>
        <input type="submit" value='Upload' className='btn btn-primary btn-block mt-4' />
      </form>
      {uploadedFile?(
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img src={'public'+uploadedFile.filePath} style={{width:'100%'}} alt=''/>

          </div>
        </div>
      ):null}
    </Fragment>
  )
}

