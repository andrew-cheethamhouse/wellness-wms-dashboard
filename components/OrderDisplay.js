import { XMarkIcon } from '@heroicons/react/20/solid'
import useSWR from "swr"
import axios from "axios"
import { useEffect, useState } from 'react'
import OrderNotFound from './OrderNotFound'

const fetcher = (url, salesOrderNumber, environment, getList) => (
  axios.get(url, {
      params: {
        SaleOrderNumber: salesOrderNumber,
        Environment: environment,
        FullList: getList
      }
  }).then((res) => res.data)
)

const dateFormat = (date) => {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var dateObj  = new Date(date);
  return dateObj.toLocaleDateString("en-GB", options)
}

export default function OrderDisplay({salesOrderNumber, environment}) {
  const [salesOrderId, setSalesOrderId] = useState();
  const [salesOrderData, setSalesOrderData] = useState();
  const [searchEnvironment, setSearchEnvironment] = useState('dev');
  const {data: salesOrder, error } = useSWR(
    ['/api/salesorder', salesOrderNumber, environment],
    (url, id, env) => fetcher(url, id, env, false),
    { errorRetryCount: 3 }
  )

  useEffect(() => {
    if (salesOrder) {
      setSalesOrderData(salesOrder);
    }
  }, [salesOrder]);

  const clearSalesOrderData = () => {
    if (salesOrderData) {
      setSalesOrderData(null)
    }
  }

  if (error) {
    return <p>Failed to load.</p>;
  }

  if (!salesOrderData || salesOrderData.length == 0) {
    return
  }

  if (salesOrderData.ErrorCode == 401) {
    return
  }

  if (salesOrderData.ErrorCode == 400) {
    return <OrderNotFound message={salesOrderData.Exception}></OrderNotFound>
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <button
              onClick={clearSalesOrderData}
              type="button"
              className=" float-right inline-flex rounded-md p-1.5 text-black hover:bg-grey-500 focus:outline-none"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
      <div className="grid grid-cols-2">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 uppercase">{salesOrderData.Customer}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{salesOrderData.Order.SaleOrderNumber} ({dateFormat(salesOrderData.SaleOrderDate)})</p>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-normal leading-6 text-right text-gray-900 uppercase">ORDER STATUS: <span className="font-medium">{salesOrderData.Order.Status}</span></h3>
      </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Order Total</dt>
            <dd className="mt-1 text-sm text-gray-900">£{salesOrderData.Order.Total}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Shipping Country</dt>
            <dd className="mt-1 text-sm text-gray-900">{salesOrderData.ShippingAddress.Country}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Contact</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">{salesOrderData.Contact}</dd>
          </div>
          {salesOrderData.ShippingNotes ? <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {salesOrderData.ShippingNotes}
            </dd>
          </div> : ""}
          
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Products</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                {salesOrderData.Order.Lines.map((item, idx) => {
                  return <li key={idx} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                  <div className="flex w-0 flex-1 items-center">
                    <span className="ml-2 w-0 flex-1 truncate">{item.Quantity} x {item.Name}</span>
                  </div>
                </li>
                })}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
