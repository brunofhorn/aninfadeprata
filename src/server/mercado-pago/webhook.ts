import { createHmac, timingSafeEqual } from 'node:crypto'

function parseSignatureHeader(signatureHeader: string | null) {
  if (!signatureHeader) {
    return null
  }

  const parsed = signatureHeader
    .split(',')
    .map((item) => item.trim())
    .reduce<Record<string, string>>((accumulator, item) => {
      const [key, value] = item.split('=')

      if (key && value) {
        accumulator[key] = value
      }

      return accumulator
    }, {})

  if (!parsed.ts || !parsed.v1) {
    return null
  }

  return {
    ts: parsed.ts,
    v1: parsed.v1,
  }
}

export function verifyMercadoPagoWebhookSignature({
  payload,
  request,
}: {
  payload: unknown
  request: Request
}) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim()

  if (!secret) {
    return true
  }

  const signature = parseSignatureHeader(request.headers.get('x-signature'))
  const requestId = request.headers.get('x-request-id')

  if (!signature?.ts || !signature.v1 || !requestId) {
    return false
  }

  const url = new URL(request.url)
  const bodyId =
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    payload.data &&
    typeof payload.data === 'object' &&
    'id' in payload.data
      ? payload.data.id
      : null

  const dataId =
    typeof bodyId === 'string' || typeof bodyId === 'number'
      ? String(bodyId).toLowerCase()
      : url.searchParams.get('data.id')?.toLowerCase() ??
        url.searchParams.get('id')?.toLowerCase() ??
        null

  if (!dataId) {
    return false
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${signature.ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')

  const expectedBuffer = Buffer.from(expected, 'utf8')
  const receivedBuffer = Buffer.from(signature.v1, 'utf8')

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer)
}
