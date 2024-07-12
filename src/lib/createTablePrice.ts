import { products } from './products'

import { imaskCurrency } from './imask'

interface PrintProduct {
    name: string,
    price: string
}

function printProducts(productsForm: Product): PrintProduct[] {
    const productsKeys = Object.keys(productsForm)

    const printProducts: PrintProduct[] = []

    productsKeys.forEach(key => {
        const id = Number(key.substring(7))
        const priceSuggested = productsForm[key]?.suggested || '0'

        if (Number(priceSuggested) > 0) {
            printProducts.push({
                name: products[id],
                price: imaskCurrency(priceSuggested)
            })
        }
    })

    return printProducts
}

export function createTablePrice(productsForm: Product) {
    const productsList = printProducts(productsForm)
    console.log(productsList)

    let html = `<html><head><style>*{margin:0;padding:0;font-size:18px}body{max-width:90mm;width:95%;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.content{display:flex;flex-direction:column;gap:10px}.price{text-align:right;min-width:100px}table,tbody,td,tfoot,th,thead,tr{border-collapse:collapse;border:1px solid #000;padding:5px}</style></head><body><div class="content"><table><thead><th>Produto</th><th>Preço (KG)</th></thead><tbody>`

    productsList.forEach(({ name, price }) => {
        html += `<tr><td class="description">${name}</td><td class="price">${price}</td></tr>`
    })

    html += `</tbody></table></div></body></html>`

    return html
}