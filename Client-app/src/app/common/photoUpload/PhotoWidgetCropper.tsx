import Cropper, { type ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import type { RefObject } from 'react';

interface props {
    preview: string;
    cropperRef: RefObject<ReactCropperElement | null>;
}

function PhotoWidgetCropper({preview, cropperRef}: props) {
  return (
    <Cropper
        className='w-60 h-60 mx-auto'
        src={preview}
        initialAspectRatio={1}
        aspectRatio={1}
        guides={false}
        center={true}
        preview={".img-preview"}
        viewMode={1}
        autoCropArea={1}
        background={false}
        ref={cropperRef}
    />
  )
}

export default PhotoWidgetCropper