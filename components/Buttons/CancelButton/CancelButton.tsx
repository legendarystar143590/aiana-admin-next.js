const CancelButton = ({t, handleCancelClick}:{t:any, handleCancelClick:()=>void}) => (  
  <button
    type="button"
    className="bg-white px-4 py-2 rounded-md bg-center bg-no-repeat max-sm:w-full text-gray-600 border border-gray-300"
    onClick={handleCancelClick}
  >
    {t('Cancel')}
  </button>  
)

export default CancelButton