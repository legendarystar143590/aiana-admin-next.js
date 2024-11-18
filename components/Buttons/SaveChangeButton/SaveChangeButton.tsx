import Spinner from "@/components/Spinner"
import Image from "next/image"

const SaveChangesButton = ({isSaving,isSaved,handleSubmit,t}:{isSaving:boolean,isSaved:boolean,handleSubmit:()=>void,t:any}) => (
  <button
    type="button"
    className={`max-sm:w-full px-4 py-2 rounded-md ${isSaving||isSaved ? 'cursor-not-allowed bg-gray-300 text-gray-600' : 'bg-black text-white'}`}
    onClick={(isSaving||isSaved)? () =>{} : handleSubmit}
  >
    <span className="flex items-center justify-center gap-2">
      {!isSaving && <Image src={`/images/buttons/${isSaved?'icon_black_diskette.png':'icon_white_diskette.png'}`} alt="save" width={20} height={20} />}
      {isSaving? <Spinner color=""/>:t('SaveChanges')}
    </span>
  </button>
)


export default SaveChangesButton