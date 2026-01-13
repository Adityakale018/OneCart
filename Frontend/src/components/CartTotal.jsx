import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Title from './Title'

function CartTotal() {
    const {currency, getTotalAmount, delivery_fee} = useContext(shopDataContext)

    return (
        <div className='w-full'>
            <div className='mb-4'>
                <Title text1={"CART "} text2={"TOTAL"}/>
            </div>

            <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4'>
                
                {/* Subtotal */}
                <div className='flex justify-between items-center text-slate-300'>
                    <span className='text-base'>Subtotal</span>
                    <span className='text-white font-semibold text-lg'>
                        {currency}{getTotalAmount()}.00
                    </span>
                </div>

                <div className='h-px bg-slate-800'></div>

                {/* Delivery Fee */}
                <div className='flex justify-between items-center text-slate-300'>
                    <span className='text-base'>Delivery Fee</span>
                    <span className='text-white font-semibold text-lg'>
                        {currency}{delivery_fee}.00
                    </span>
                </div>

                <div className='h-px bg-slate-800'></div>

                {/* Total */}
                <div className='flex justify-between items-center pt-2'>
                    <span className='text-white text-lg font-bold'>Total</span>
                    <span className='text-violet-400 text-2xl font-bold'>
                        {currency}{getTotalAmount() === 0 ? 0 :  getTotalAmount() + delivery_fee}.00
                    </span>
                </div>

                {/* Optional:  Savings Badge */}
                {getTotalAmount() > 0 && (
                    <div className='pt-4 border-t border-slate-800'>
                        <div className='flex items-center gap-2 text-emerald-400 text-sm'>
                            <span>✓</span>
                            <span>Free delivery on orders above {currency}500</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartTotal