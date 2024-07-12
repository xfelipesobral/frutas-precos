function profitPercent(value: number) {
    if (value > 5) return 0.5
    if (value > 2.5) return 0.7
    if (value > 1.5) return 0.8
    if (value > 1) return 1
    return 1.5
}

function calculateSuggestedPrice(value: number) {
    return (value * profitPercent(value)) + value
}

export default calculateSuggestedPrice