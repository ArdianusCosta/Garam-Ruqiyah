import crypto from 'crypto'

const IPAYMU_VA = process.env.IPAYMU_VA || ''
const IPAYMU_API_KEY = process.env.IPAYMU_API_KEY || ''
const IPAYMU_IS_PRODUCTION = process.env.IPAYMU_IS_PRODUCTION === 'true'

const BASE_URL = IPAYMU_IS_PRODUCTION 
  ? 'https://my.ipaymu.com/api/v2'
  : 'https://sandbox.ipaymu.com/api/v2'

export async function createIpaymuTransaction({
  method,
  referenceId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  products,
  quantities,
  prices,
  returnUrl,
  notifyUrl,
  cancelUrl
}: {
  method?: string,
  referenceId: string,
  amount: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  products: string[],
  quantities: number[],
  prices: number[],
  returnUrl?: string,
  notifyUrl?: string,
  cancelUrl?: string
}) {
  const payload: Record<string, any> = {
    product: products,
    qty: quantities,
    price: prices,
    amount: amount,
    returnUrl: returnUrl || '',
    cancelUrl: cancelUrl || '',
    notifyUrl: notifyUrl || '',
    referenceId: referenceId,
    buyerName: customerName,
    buyerEmail: customerEmail,
    buyerPhone: customerPhone
  }
  
  if (method) {
    payload.paymentMethod = method
  }

  const jsonBody = JSON.stringify(payload)
  
  // 1. Generate SHA256 of the body
  const bodyHash = crypto.createHash('sha256').update(jsonBody).digest('hex').toLowerCase()

  // 2. Generate Timestamp (YYYYMMDDHHmmss)
  // Use local time or just ISO string digits. iPaymu expects YYYYMMDDHHmmss
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`

  // 3. String to sign
  const stringToSign = `POST:${IPAYMU_VA}:${bodyHash}:${IPAYMU_API_KEY}`
  
  // 4. Generate HMAC-SHA256
  const signature = crypto
    .createHmac('sha256', IPAYMU_API_KEY)
    .update(stringToSign)
    .digest('hex')

  const response = await fetch(`${BASE_URL}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'va': IPAYMU_VA,
      'signature': signature,
      'timestamp': timestamp
    },
    body: jsonBody
  })

  const data = await response.json()
  
  if (!response.ok || data.Status !== 200) {
    console.error('iPaymu API Error:', data)
    throw new Error(data.Message || 'Failed to create iPaymu transaction')
  }

  // Returns { SessionID, url }
  return data.Data
}
