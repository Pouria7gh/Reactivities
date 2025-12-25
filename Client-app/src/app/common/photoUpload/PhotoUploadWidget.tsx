
interface props {
    className?: string;
}

function PhotoUploadWidget({className}: props) {
  return (
    <div className={`grid grid-cols-12 ${className}`}>
        <div className="col-span-4">drop photo</div>
        <div className="col-span-4">crop photo</div>
        <div className="col-span-4">upload photo</div>
    </div>
  )
}

export default PhotoUploadWidget