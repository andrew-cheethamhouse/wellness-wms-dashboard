// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const { Environment, FullList } = req.query;
  const accountId =
    Environment == "dev"
      ? process.env.DEAR_DEV_API_AUTH_ACCOUNT_ID
      : process.env.DEAR_API_AUTH_ACCOUNT_ID;
  const applicationKey =
    Environment == "dev"
      ? process.env.DEAR_DEV_API_AUTH_APPLICATIONKEY
      : process.env.DEAR_API_AUTH_APPLICATIONKEY;

  async function DearData(url, method) {
    const options = {
      endpoint: url,
      method: method,
      headers: {
        "Content-Type": "application/json",
        "api-auth-accountid": accountId,
        "api-auth-applicationkey": applicationKey,
      },
    };

    const data = await fetch(url, options).then((response) => {
    if (response.status >= 500) {
        throw new Error(response.statusText);
    }
    try {
        return response.json();
    } catch (error) {
        console.log("Error:", error);
        console.log("Response:", response);
    }
    });

    return data;
  }

  async function getSalesIDByOrderNumber(orderNumber, fullList) {
    let url = `https://inventory.dearsystems.com/ExternalApi/v2/saleList`;
    if (fullList == "false") {
      url = url + `?Search=${orderNumber}`;
    } else {
      url = url + `?Limit=1000&&CombinedShippingStatus=NOT SHIPPED&page=1`;
    }

    try {
    const response = await DearData(url, "GET");
        if (
            typeof response.SaleList !== undefined &&
            response.SaleList.length > 0
        ) {
        const salesOrders = response.SaleList.filter((sale) => {
            return sale.CombinedPickingStatus == "PICKED";
        });

        if (salesOrders.length > 0 && fullList !== "false") {
            const saleOrderIds = salesOrders.map((order) => {
            return order.SaleID;
            });
            return saleOrderIds;
        }

        if (salesOrders.length > 0) {
            return salesOrders[0].SaleID;
        }
        }
        return "";
    } catch (Error) {
        setTimeout(function () {
            console.log("Waiting...")
            getSalesIDByOrderNumber(orderNumber, fullList);
        }, 60000);
    }
  }

  async function getSalesOrder(salesOrderId) {
    if (salesOrderId == "") {
      return { ErrorCode: 400, Exception: "Sale with specified ID not found" };
    }

    const url = `https://inventory.dearsystems.com/ExternalApi/v2/sale?ID=${salesOrderId}&IncludeProductInfo=true`;
    try {
      const response = await DearData(url, "GET");
      const salesData = response.ID ? response : [];
      return salesData;
    } catch (Error) {
      setTimeout(function () {
        console.log("Waiting...")
        getSalesOrder(salesOrderId);
      }, 60000);
    }
  }

  const { SaleOrderNumber } = req.query;
  let salesOrder = [];

  if (SaleOrderNumber || FullList == "true") {
    if (SaleOrderNumber.length == 36) {
      salesOrder = await getSalesOrder(SaleOrderNumber);
      res.status(200);
      res.json(salesOrder);
      return;
    }

    const saleID = await getSalesIDByOrderNumber(SaleOrderNumber, FullList);
    if (Array.isArray(saleID)) {
      const orderList = [];
      for (const id in saleID) {
        const orderData = await getSalesOrder(saleID[id]);
        if (orderData && orderData.ID) {
          orderList.push(orderData);
        }
      }
      res.status(200);
      res.json(orderList);
      return;
    } else {
      salesOrder = await getSalesOrder(saleID);
      res.status(200);
      res.json(salesOrder);
    }
  } else {
    res.status(204);
  }
}
