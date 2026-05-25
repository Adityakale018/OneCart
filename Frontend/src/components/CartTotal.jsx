import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'

function CartTotal() {
    const { currency, getTotalAmount, delivery_fee, FREE_DELIVERY_ABOVE } = useContext(shopDataContext)
    const subtotal = getTotalAmount();
    const remaining = FREE_DELIVERY_ABOVE - subtotal;

    return (
        <div className='w-full'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">PRICE DETAILS ({subtotal > 0 ? '1 Item' : '0 Items'})</h3>
            </div>

            {/* Free delivery progress */}
            {subtotal > 0 && (
                <div className='mb-4'>
                    {delivery_fee === 0 ? (
                        <p className='text-xs text-[#03a685] font-semibold flex items-center gap-1'>
                            🎉 You get FREE delivery on this order!
                        </p>
                    ) : (
                        <>
                            <p className='text-xs text-gray-500 mb-1.5'>
                                Add <span className='font-bold text-gray-800'>{currency}{remaining}</span> more for <span className='font-bold text-[#03a685]'>FREE delivery</span>
                            </p>
                            <div className='w-full h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                                <div
                                    className='h-full bg-[#03a685] rounded-full transition-all duration-500'
                                    style={{ width: `${Math.min((subtotal / FREE_DELIVERY_ABOVE) * 100, 100)}%` }}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className='space-y-4 text-sm'>
                
                {/* Subtotal */}
                <div className='flex justify-between items-center text-gray-700'>
                    <span>Total MRP</span>
                    <span>{currency}{subtotal}.00</span>
                </div>

                {/* Delivery Fee */}
                <div className='flex justify-between items-center text-gray-700'>
                    <span>Convenience Fee</span>
                    <span className={delivery_fee === 0 ? "text-[#03a685] font-semibold" : ""}>
                        {delivery_fee === 0 ? 'FREE' : `${currency}${delivery_fee}.00`}
                    </span>
                </div>

                <div className='h-px bg-gray-200 my-2'></div>

                {/* Total */}
                <div className='flex justify-between items-center pt-2'>
                    <span className='text-gray-900 font-bold text-base'>Total Amount</span>
                    <span className='text-gray-900 font-bold text-base'>
                        {currency}{subtotal === 0 ? 0 : subtotal + delivery_fee}.00
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CartTotal