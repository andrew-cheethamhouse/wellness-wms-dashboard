import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import OrderListNotFound from "./OrderListNotFound";

const salesOrderNumber = null;
const fetcher = (url, salesOrderNumber, environment, getList) =>
  axios
    .get(url, {
      params: {
        SaleOrderNumber: salesOrderNumber,
        Environment: environment,
        FullList: getList,
      },
    })
    .then((res) => res.data);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function OrderListDisplay({ environment, setSalesOrderId }) {
  const [salesOrderListData, setSalesOrderListData] = useState();
  const { data: salesOrderList, error } = useSWR(
    ["/api/salesorder", salesOrderNumber, environment],
    (url, id, env) => fetcher(url, id, env, true),
    { errorRetryCount: 3 }
  );

  useEffect(() => {
    if (salesOrderList) {
      setSalesOrderListData(salesOrderList);
    }
  }, [salesOrderList]);

  if (!salesOrderList || salesOrderList.length == 0) {
    return  <div className="p-4 rounded-lg sm:px-6 lg:px-8 bg-black border-2 border-white">
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-xl font-semibold text-white">Loading orders...</h1>
      </div>
    </div>
    </div>;
  }

  if (salesOrderList.ErrorCode) {
    return (
      <OrderListNotFound message={salesOrderList.Exception}></OrderListNotFound>
    );
  }

  return (
    <div className="px-4 pt-4 rounded-lg sm:px-6 lg:px-8 bg-black border-2 border-white">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-white">Picked Orders</h1>
          <p className="mt-2 text-sm text-gray-200">
            A list of DEAR orders that are in a picked state.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="shadow-sm ring-1 ring-black ring-opacity-5">
              <table
                className="min-w-full border-separate"
                style={{ borderSpacing: 0 }}
              >
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
                <tbody className="bg-white">
                  {salesOrderList.map((order, orderIdx) => (
                    <tr key={order.Order.SaleOrderNumber}>
                      <td
                        className={classNames(
                          orderIdx !== order.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                        )}
                      >
                        {order.Order.SaleOrderNumber}
                      </td>
                      <td
                        className={classNames(
                          orderIdx !== order.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                        )}
                      >
                        {order.Customer}
                      </td>
                      <td
                        className={classNames(
                          orderIdx !== order.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
                        )}
                      >
                        {order.Order.Lines.length}
                      </td>
                      <td
                        className={classNames(
                          orderIdx !== order.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        )}
                      >
                        £{order.Order.Total}
                      </td>
                      <td
                        className={classNames(
                          orderIdx !== order.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
                        )}
                      >
                        <a
                          href="#"
                          onClick={() => {
                            setSalesOrderId(order.ID);
                          }}
                          className="text-white bg-black px-4 py-2 rounded-lg"
                        >
                          View
                          <span className="sr-only">, {order.Customer}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
