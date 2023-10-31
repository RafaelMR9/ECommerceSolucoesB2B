export default function Modal (props) {
  if (!props.isOpen)
    return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg px-6 py-6 w-100">
        <h2 className="text-xl font-bold mb-4 text-white">{props.title}</h2>
        <p className="font-semibold text-lg text-gray-200">{props.message}</p>
        {props.leading && <p className="font-semibold mt-4 text-md text-red-400">{props.leading}</p>}
        <div className="mt-5 flex justify-between">
          <button className={`${props.confirm ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} text-white text-lg py-2 px-4 rounded`} onClick={props.onConfirm}>
            {props.option1}
          </button>
          {props.option2 && 
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-900 text-lg py-2 px-4 rounded" onClick={props.onClose}>
              {props.option2}
            </button>
          }
        </div>
      </div>
    </div>
  )
}