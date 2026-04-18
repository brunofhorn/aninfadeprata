import { randomUUID } from 'node:crypto'

const DEFAULT_MERCADO_PAGO_API_URL = 'https://api.mercadopago.com'

interface MercadoPagoRequestInit extends Omit<RequestInit, 'headers'> {
  headers?: HeadersInit
  idempotencyKey?: string
}

function getMercadoPagoApiUrl() {
  return process.env.MERCADO_PAGO_API_URL?.trim() || DEFAULT_MERCADO_PAGO_API_URL
}

function getMercadoPagoAccessToken() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim()

  if (!accessToken) {
    throw new Error('MERCADO_PAGO_ACCESS_TOKEN nao foi configurado no ambiente.')
  }

  return accessToken
}

async function parseMercadoPagoResponse(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

function getMercadoPagoErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === 'object') {
    if ('message' in payload && typeof payload.message === 'string') {
      return payload.message
    }

    if ('error' in payload && typeof payload.error === 'string') {
      return payload.error
    }

    if ('cause' in payload && Array.isArray(payload.cause) && payload.cause.length > 0) {
      const firstCause = payload.cause[0]

      if (
        firstCause &&
        typeof firstCause === 'object' &&
        'description' in firstCause &&
        typeof firstCause.description === 'string'
      ) {
        return firstCause.description
      }
    }
  }

  return fallback
}

export async function mercadoPagoRequest<T>(
  path: string,
  init: MercadoPagoRequestInit = {},
) {
  const method = init.method ?? 'GET'
  const response = await fetch(`${getMercadoPagoApiUrl()}${path}`, {
    ...init,
    method,
    headers: {
      Authorization: `Bearer ${getMercadoPagoAccessToken()}`,
      'Content-Type': 'application/json',
      ...(method !== 'GET' ? { 'X-Idempotency-Key': init.idempotencyKey ?? randomUUID() } : {}),
      ...init.headers,
    },
  })

  const payload = await parseMercadoPagoResponse(response)

  if (!response.ok) {
    throw new Error(
      getMercadoPagoErrorMessage(
        payload,
        'Nao foi possivel concluir a requisicao ao Mercado Pago.',
      ),
    )
  }

  return payload as T
}
