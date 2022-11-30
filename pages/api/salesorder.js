// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const {Environment} = req.query
  const accountId = Environment == "dev" ? process.env.DEAR_DEV_API_AUTH_ACCOUNT_ID : process.env.DEAR_API_AUTH_ACCOUNT_ID
  const applicationKey = Environment == "dev" ? process.env.DEAR_DEV_API_AUTH_APPLICATIONKEY : process.env.DEAR_API_AUTH_APPLICATIONKEY

  async function DearData(url, method) {
      const options = {
          endpoint: url,
          method: method,
          headers: {
              "Content-Type": "application/json",
              "api-auth-accountid": accountId,
              "api-auth-applicationkey": applicationKey
          },
      }

      try {
          const data = await fetch(url, options).then(response => {
            return response.json()
          })

          return data
      } catch (error) {
          console.log("Query", url)
          console.log("Error:", error)
          throw new Error("Query Failed")
      }
  }


  async function getSalesIDByOrderNumber(orderNumber) {
    const url = `https://inventory.dearsystems.com/ExternalApi/v2/saleList?Search=${orderNumber}`
    const response = await DearData(url, "GET")
    if (typeof response.SaleList !== undefined && response.SaleList.length > 0) {
        const salesOrders = response.SaleList.filter(sale => {
            return sale.FulFilmentStatus == "NOT FULFILLED"
        })
        if (salesOrders.length > 0) {
            return salesOrders[0].SaleID
        }
    }
    return ""
}

  async function getSalesOrder(salesOrderId) {
    if (salesOrderId == "") {
        return { ErrorCode: 400, Exception: 'Sale with specified ID not found' }
    }
    
      const url = `https://inventory.dearsystems.com/ExternalApi/v2/sale?ID=${salesOrderId}&IncludeProductInfo=true`
      const response = await DearData(url, "GET")
      if (!response.ID && typeof response[0] !== undefined) {
        return response[0]
      }

      const salesData = response.ID ? response : []
      return salesData
  }

  const {SaleOrderNumber} = req.query
  let salesOrder = []

  if (SaleOrderNumber) {
    const saleID = await getSalesIDByOrderNumber(SaleOrderNumber)
    salesOrder = await getSalesOrder(saleID)
  }
  res.status(200)
  res.json(salesOrder)
}
