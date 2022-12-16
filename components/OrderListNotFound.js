import React from 'react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function OrderListNotFound() {
    const orderIdx = 0
    const order = {}
    return (
        <div className="px-4 pt-4 rounded-md sm:px-6 lg:px-8 bg-gray-200">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Picked Orders</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of DEAR orders that are in a picked state.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm sm:w-auto"
            >
              Refresh
            </button>
          </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                  <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                        >
                          Order Number
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                        >
                          Order Lines
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                        >
                          Order Total
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                        >
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
}
