export function saveValues(text: string) {
    localStorage.setItem('products', text)
}

export function getValues() {
    return localStorage.getItem('products')
}