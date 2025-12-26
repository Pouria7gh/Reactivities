import { useEffect, useRef, useState } from "react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import type {FileWithPreview} from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import type { ReactCropperElement } from "react-cropper";
import { useStore } from "../../stores/Store";
import { observer } from "mobx-react-lite";

interface props {
  className?: string;
  setEditMode?: (state: boolean) => void;
}

function PhotoUploadWidget({className, setEditMode}: props) {
  const [files, setFiles] = useState<FileWithPreview[]>();
  const {profileStore: {uploading, uploadPhoto}} = useStore();
  const cropperRef = useRef<ReactCropperElement>(null);

  useEffect(() => {
    return () => {
      files?.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    }
  }, [files]);

  function handleUploadPhoto() {
    if (!cropperRef.current) return;
    const cropper = cropperRef.current.cropper;
    cropper!.getCroppedCanvas().toBlob(blob => {
      uploadPhoto(blob!).then(() => {
        if (setEditMode) setEditMode(false);
      })
    })
  }

  return (
    <div className={`grid grid-cols-12 gap-4 ${className}`}>
        <div className="col-span-4">
          <PhotoWidgetDropzone setFile={setFiles}/>
        </div>
        <div className="col-span-4">
          {files &&
          <PhotoWidgetCropper preview={files[0].preview} cropperRef={cropperRef} />}
        </div>

        {files &&
          <div className="col-span-4 img-preview overflow-hidden w-60 h-60 mx-auto"></div>
        }

        <div className="col-span-12">
          {files && (<>
            <button 
              className="btn btn-success" 
              onClick={handleUploadPhoto} 
              disabled={uploading}
            >
              {uploading && <span className="loading loading-sm"></span>}
              {!uploading && "Upload"}
            </button>
            
            <button 
              className="btn"
              disabled={uploading}
              onClick={() => setFiles(undefined)}
            >
              Clear
            </button>
          </>)}
        </div>
    </div>
  )
}

export default observer(PhotoUploadWidget)