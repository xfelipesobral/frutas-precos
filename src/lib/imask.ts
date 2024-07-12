import IMask from 'imask'

export function imaskDecimal(value: string = ''): string {
    const mask = IMask.createMask({
        mask: Number,
        thousandsSeparator: '.',
        normalizeZeros: true,
        scale: 2,
        padFractionalZeros: true,
    })

    mask.resolve(value.replace(/[.]/g, ','))

    return mask.value
}

export function imaskCurrency(price: string = ''): string {
    return `R$ ${imaskDecimal(price)}`
}