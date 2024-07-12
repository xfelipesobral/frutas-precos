import { Controller, useForm } from 'react-hook-form'
import { ChevronUp, Printer, Search } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { productsSorted } from '../../lib/products'
import { Input, InputNumber } from '../../components/ui/input'
import calculateSuggestedPrice from '../../lib/suggestedPrice'
import { getValues as getValuesCache, saveValues } from '../../lib/cache'
import { Button } from '../../components/ui/button'
import { createTablePrice } from '../../lib/createTablePrice'
import { useState } from 'react'

export default function Prices() {
    const [filter, setFilter] = useState('')

    const { control, getValues } = useForm<Product>({
        defaultValues: JSON.parse(getValuesCache() || '{}')
    })

    const print = () => {
        const printWindow = window.open('', 'Print', 'height=400,width=600')
        if (!printWindow) return

        printWindow.document.write(createTablePrice(getValues()))
        printWindow.print()
        printWindow.close()
    }

    return (
        <div className='flex flex-col items-center justify-center my-4'>

            <div className='sm:max-w-[500px] w-full bg-white shadow-lg sm:m-4 rounded-lg'>
                <div className='border-b p-4 grid gap-4'>
                    <div>
                        <h1 className='font-semibold tracking-tight text-2xl'>Cálculo de Preços</h1>
                        <p className='text-sm text-gray-600'>Determinação do preço sugerido com base no valor de custo</p>
                    </div>
                    <div className='flex gap-4'>
                        <div className='relative flex-1'>
                            <Search className='absolute left-2.5 h-full w-4 text-muted-foreground' />
                            <Input
                                type='search'
                                placeholder='Buscar nome do produto'
                                className='w-full rounded-lg bg-background pl-8'
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={print}
                        >
                            <Printer className='w-4 h-4 mr-2 ' /> Imprimir
                        </Button>
                    </div>
                </div>
                <Table>
                    <TableHeader className='bg-gray-100'>
                        <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className='text-right'>Preço Pago (R$)</TableHead>
                            <TableHead className='text-right'>Preço Sugerido (R$)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productsSorted.filter(item => {
                            if (!filter) return true
                            return item.name.toLowerCase().includes(filter.toLowerCase())
                        }).map(({ id, name }) => (
                            <TableRow key={id}>
                                <TableCell className='font-medium'>{name}</TableCell>
                                <Controller
                                    control={control}
                                    name={`product${id}`}
                                    render={({ field: { value, onChange } }) => {

                                        const paid = value?.paid || ''
                                        const suggested = value?.suggested || ''

                                        const handleChange = (key: 'paid' | 'suggested', newValue: string = '') => {
                                            let finalPaid = paid
                                            let finalSuggested = suggested

                                            if (key === 'paid') {
                                                finalPaid = newValue
                                                finalSuggested = calculateSuggestedPrice(Number(finalPaid)).toFixed(2)
                                            } else {
                                                finalSuggested = newValue
                                            }

                                            onChange({
                                                paid: finalPaid,
                                                suggested: finalSuggested
                                            })

                                            saveValues(JSON.stringify(getValues()))
                                        }

                                        return (
                                            <>
                                                <TableCell className='max-w-[170px]'>
                                                    <InputNumber
                                                        placeholder='0.00'
                                                        className='text-right'
                                                        value={paid}
                                                        decimalSeparator='.'
                                                        onChange={(e) => handleChange('paid', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className='max-w-[170px]'>
                                                    <InputNumber
                                                        placeholder='0.00'
                                                        className='text-right'
                                                        value={suggested}
                                                        decimalSeparator='.'
                                                        onChange={(e) => handleChange('suggested', e.target.value)}
                                                    />
                                                </TableCell>
                                            </>
                                        )
                                    }}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className='fixed bottom-0 right-0 p-4'>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className='bg-gray-900 hover:bg-gray-800 duration-500 transition-all text-white rounded-full w-10 h-10 flex items-center justify-center'
                >
                    <ChevronUp className='h-6 w-6' />
                </button>
            </div>
            <p className='text-gray-400'>{new Date().getFullYear()} - <a className='hover:underline' href='https://github.com/xfelipesobral/frutas-precos'>Github</a></p>
        </div>
    )
}