export default function OrderNotFound({message}) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="grid grid-cols-2">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 uppercase">{message}</h3>
      </div>
      </div>
    </div>
  )
}
