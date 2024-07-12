interface Price {
    paid: string,
    suggested: string
}

interface Product {
    [key: string]: Price
}