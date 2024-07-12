import { Controller, useForm } from 'react-hook-form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { products } from '../../lib/products'
import { InputNumber } from '../../components/ui/input'
import calculateSuggestedPrice from '../../lib/suggestedPrice'
import { getValues as getValuesCache, saveValues } from '../../lib/cache'
import { Button } from '../../components/ui/button'
import { Eraser, Printer } from 'lucide-react'

interface Form {
    [key: string]: { paid: string, suggested: string }
}

export default function Prices() {

    const { control, getValues } = useForm<Form>({
        defaultValues: JSON.parse(getValuesCache() || '{}')
    })

    const resetValues = () => {
        saveValues('{}')
        window.location.reload()
    }

    const print = () => {
        const printWindow = window.open('', 'Print', 'height=400,width=600')
        if (!printWindow) return

        printWindow.document.write('<p>Printed</p>')
        printWindow.print()
        printWindow.close()

    }

    return (
        <div className='flex flex-col items-center justify-center my-4'>

            <div className='sm:max-w-[500px] bg-white shadow-lg sm:m-4 rounded-lg'>
                <div className='border-b p-4 grid gap-4'>
                    <div>
                        <h1 className='font-semibold tracking-tight text-2xl'>Cálculo de Produtos</h1>
                        <p className='text-sm text-gray-600'>Determinação do preço sugerido com base no valor de custo</p>
                    </div>
                    <div className='flex gap-4'>
                        <Button
                            onClick={print}
                            className='flex-1'
                        >
                            <Printer className='w-4 h-4 mr-2' /> Imprimir
                        </Button>
                        <Button
                            onClick={resetValues}
                            variant={'secondary'}
                        >
                            <Eraser className='w-4 h-4 mr-2' /> Limpar lista
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
                        {products.map((productName, id) => (
                            <TableRow key={id}>
                                <TableCell className='font-medium'>{productName}</TableCell>
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
                                                <TableCell>
                                                    <InputNumber
                                                        placeholder='0.00'
                                                        className='text-right'
                                                        value={paid}
                                                        decimalSeparator='.'
                                                        onChange={(e) => handleChange('paid', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
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
        </div>
    )
}