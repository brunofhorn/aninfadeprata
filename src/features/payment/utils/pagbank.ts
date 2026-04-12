import { onlyDigits } from '@/utils/masks'

const PAGBANK_SDK_URL =
  'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js'

interface PagBankEncryptRequest {
  publicKey: string
  holderName: string
  cardNumber: string
  expiry: string
  securityCode: string
}

interface PagSeguroError {
  code: string
  message: string
}

interface PagSeguroEncryptResult {
  encryptedCard?: string
  hasErrors: boolean
  errors?: PagSeguroError[]
}

interface PagSeguroSdk {
  encryptCard: (payload: {
    publicKey: string
    holder: string
    number: string
    expMonth: string
    expYear: string
    securityCode: string
  }) => PagSeguroEncryptResult
}

declare global {
  interface Window {
    PagSeguro?: PagSeguroSdk
  }
}

function getSdk() {
  if (!window.PagSeguro) {
    throw new Error('SDK do PagBank nao foi carregado.')
  }

  return window.PagSeguro
}

let sdkPromise: Promise<PagSeguroSdk> | null = null

export function loadPagBankSdk() {
  if (window.PagSeguro) {
    return Promise.resolve(window.PagSeguro)
  }

  if (sdkPromise) {
    return sdkPromise
  }

  sdkPromise = new Promise<PagSeguroSdk>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${PAGBANK_SDK_URL}"]`,
    )

    const handleLoad = () => {
      try {
        resolve(getSdk())
      } catch (error) {
        reject(error)
      }
    }

    if (existingScript) {
      if (window.PagSeguro) {
        handleLoad()
        return
      }

      existingScript.addEventListener('load', handleLoad, { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Nao foi possivel carregar o SDK do PagBank.')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = PAGBANK_SDK_URL
    script.async = true
    script.onload = handleLoad
    script.onerror = () => reject(new Error('Nao foi possivel carregar o SDK do PagBank.'))
    document.body.appendChild(script)
  })

  return sdkPromise
}

function parseExpiry(expiry: string) {
  const digits = onlyDigits(expiry)

  if (digits.length !== 4) {
    throw new Error('Informe a validade no formato MM/AA.')
  }

  const expMonth = digits.slice(0, 2)
  const expYear = `20${digits.slice(2)}`

  return { expMonth, expYear }
}

function mapPagBankError(error: PagSeguroError) {
  const errorMessages: Record<string, string> = {
    INVALID_NUMBER: 'Numero de cartao invalido.',
    INVALID_SECURITY_CODE: 'Codigo de seguranca invalido.',
    INVALID_EXPIRATION_MONTH: 'Mes de expiracao invalido.',
    INVALID_EXPIRATION_YEAR: 'Ano de expiracao invalido.',
    INVALID_PUBLIC_KEY: 'Chave publica do PagBank invalida.',
    INVALID_HOLDER: 'Nome do titular invalido.',
  }

  return errorMessages[error.code] ?? 'Nao foi possivel criptografar o cartao.'
}

export async function encryptCardWithPagBank({
  publicKey,
  holderName,
  cardNumber,
  expiry,
  securityCode,
}: PagBankEncryptRequest) {
  const sdk = await loadPagBankSdk()
  const { expMonth, expYear } = parseExpiry(expiry)

  const result = sdk.encryptCard({
    publicKey,
    holder: holderName.trim(),
    number: onlyDigits(cardNumber),
    expMonth,
    expYear,
    securityCode: onlyDigits(securityCode),
  })

  if (result.hasErrors || !result.encryptedCard) {
    const [firstError] = result.errors ?? []
    throw new Error(firstError ? mapPagBankError(firstError) : 'Falha ao criptografar o cartao.')
  }

  return result.encryptedCard
}
