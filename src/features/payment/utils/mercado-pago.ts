const MERCADO_PAGO_SDK_URL = 'https://sdk.mercadopago.com/js/v2'

type MercadoPagoWindow = Window & {
  MercadoPago?: new (
    publicKey: string,
    options?: {
      locale?: string
    },
  ) => MercadoPagoInstance
}

export interface MercadoPagoCardFormData {
  token?: string
  paymentMethodId?: string
  issuerId?: string
  installments?: string | number
  identificationType?: string
  identificationNumber?: string
}

export interface MercadoPagoCardFormController {
  getCardFormData: () => MercadoPagoCardFormData
  unmount?: () => void
  destroy?: () => void
}

export interface MercadoPagoInstance {
  cardForm: (config: Record<string, unknown>) => MercadoPagoCardFormController
}

function getMercadoPagoWindow() {
  return window as MercadoPagoWindow
}

export async function loadMercadoPagoSdk() {
  const existingSdk = getMercadoPagoWindow().MercadoPago

  if (existingSdk) {
    return existingSdk
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${MERCADO_PAGO_SDK_URL}"]`,
    )

    if (existingScript?.dataset.loaded === 'true') {
      resolve()
      return
    }

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Nao foi possivel carregar o SDK do Mercado Pago.')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = MERCADO_PAGO_SDK_URL
    script.async = true
    script.dataset.loaded = 'false'
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => reject(new Error('Nao foi possivel carregar o SDK do Mercado Pago.'))
    document.head.appendChild(script)
  })

  const sdk = getMercadoPagoWindow().MercadoPago

  if (!sdk) {
    throw new Error('SDK do Mercado Pago nao foi carregado corretamente.')
  }

  return sdk
}
