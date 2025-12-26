import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { FaUpload } from 'react-icons/fa';

export interface FileWithPreview extends File {
    preview: string;
}

interface props {
    setFile: (file: FileWithPreview[]) => void;
}

function PhotoWidgetDropzone({setFile}: props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
    })))
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div
        className={`flex flex-col gap-5 justify-center items-center border-2 border-dotted rounded-lg h-60
            ${isDragActive ? "border-blue-500 text-blue-500" : "border-gray-500"}`}
        {...getRootProps()}
    >
      <input {...getInputProps()} />
      <FaUpload className='text-5xl mx-auto' />
      <p>Drop Photos here</p>
    </div>
  )
}

export default PhotoWidgetDropzone;