interface StaticPixPayloadInput {
  pixKey: string
  receiverName: string
  receiverCity: string
  amount?: number
  txid?: string
}

function formatField(id: string, value: string) {
  return `${id}${value.length.toString().padStart(2, '0')}${value}`
}

function normalizePixText(value: string, maxLength: number, fallback: string) {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9/.:,\- ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()

  return (normalized || fallback).slice(0, maxLength)
}

function normalizeTxid(value?: string) {
  const normalized = (value ?? '***').replace(/[^a-zA-Z0-9]/g, '').slice(0, 25)
  return normalized || '***'
}

function formatAmount(amount?: number) {
  if (amount == null || Number.isNaN(amount) || amount <= 0) {
    return undefined
  }

  return amount.toFixed(2)
}

function crc16(payload: string) {
  let crc = 0xffff

  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8

    for (let bit = 0; bit < 8; bit += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }

      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function generateStaticPixPayload({
  pixKey,
  receiverName,
  receiverCity,
  amount,
  txid,
}: StaticPixPayloadInput) {
  const merchantAccount = [
    formatField('00', 'br.gov.bcb.pix'),
    formatField('01', pixKey.trim()),
  ].join('')

  const payloadFields = [
    formatField('00', '01'),
    formatField('26', merchantAccount),
    formatField('52', '0000'),
    formatField('53', '986'),
  ]

  const transactionAmount = formatAmount(amount)
  if (transactionAmount) {
    payloadFields.push(formatField('54', transactionAmount))
  }

  payloadFields.push(
    formatField('58', 'BR'),
    formatField('59', normalizePixText(receiverName, 25, 'RECEBEDOR')),
    formatField('60', normalizePixText(receiverCity, 15, 'SAO JOSE')),
    formatField('62', formatField('05', normalizeTxid(txid))),
  )

  const payloadWithoutCrc = `${payloadFields.join('')}6304`
  return `${payloadWithoutCrc}${crc16(payloadWithoutCrc)}`
}

export function buildPixQrCodeImageUrl(payload: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`
}
