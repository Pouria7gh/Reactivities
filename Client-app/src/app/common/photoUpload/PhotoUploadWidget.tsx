import { useState } from "react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import type {FileWithPreview} from "./PhotoWidgetDropzone";

interface props {
    className?: string;
}

function PhotoUploadWidget({className}: props) {
  const [file, setFile] = useState<FileWithPreview[]>();
  return (
    <div className={`grid grid-cols-12 gap-4 ${className}`}>
        <div className="col-span-4">
          <PhotoWidgetDropzone setFile={setFile}/>
        </div>
        <div className="col-span-4">
          {file &&
          <img src={file[0].preview} alt="photo" className="w-full" />}
        </div>
        <div className="col-span-4">upload photo</div>
    </div>
  )
}

export default PhotoUploadWidget