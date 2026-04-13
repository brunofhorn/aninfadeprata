const DEFAULT_PAGBANK_API_URL = 'https://sandbox.api.pagseguro.com'

interface PagBankRequestInit extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
}

function getPagBankApiUrl() {
  return process.env.PAGBANK_API_URL?.trim() || DEFAULT_PAGBANK_API_URL
}

function getPagBankToken() {
  const token = process.env.PAGBANK_TOKEN?.trim()

  if (!token) {
    throw new Error('PAGBANK_TOKEN nao foi configurado no ambiente.')
  }

  return token
}

async function parsePagBankResponse(response: Response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getPagBankErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === 'object') {
    if ('error_messages' in payload && Array.isArray(payload.error_messages)) {
      const firstError = payload.error_messages[0]

      if (firstError && typeof firstError === 'object' && 'description' in firstError) {
        return String(firstError.description)
      }
    }

    if ('message' in payload) {
      return String(payload.message)
    }
  }

  return fallback
}

export async function pagBankRequest<T>(path: string, init: PagBankRequestInit = {}) {
  const response = await fetch(`${getPagBankApiUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getPagBankToken()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })

  const payload = await parsePagBankResponse(response)

  if (!response.ok) {
    throw new Error(
      getPagBankErrorMessage(payload, 'Nao foi possivel concluir a requisicao ao PagBank.'),
    )
  }

  return payload as T
}
