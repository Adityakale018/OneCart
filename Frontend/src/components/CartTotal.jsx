import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'

function CartTotal() {
    const {currency, getTotalAmount, delivery_fee} = useContext(shopDataContext)

    return (
        <div className='w-full'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">PRICE DETAILS ({getTotalAmount() > 0 ? '1 Item' : '0 Items'})</h3>
            </div>

            <div className='space-y-4 text-sm'>
                
                {/* Subtotal */}
                <div className='flex justify-between items-center text-gray-700'>
                    <span>Total MRP</span>
                    <span>{currency}{getTotalAmount()}.00</span>
                </div>

                {/* Delivery Fee */}
                <div className='flex justify-between items-center text-gray-700'>
                    <span>Convenience Fee</span>
                    <span className={delivery_fee === 0 ? "text-[#03a685]" : ""}>
                        {delivery_fee === 0 ? 'FREE' : `${currency}${delivery_fee}.00`}
                    </span>
                </div>

                <div className='h-px bg-gray-200 my-2'></div>

                {/* Total */}
                <div className='flex justify-between items-center pt-2'>
                    <span className='text-gray-900 font-bold text-base'>Total Amount</span>
                    <span className='text-gray-900 font-bold text-base'>
                        {currency}{getTotalAmount() === 0 ? 0 : getTotalAmount() + delivery_fee}.00
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CartTotal