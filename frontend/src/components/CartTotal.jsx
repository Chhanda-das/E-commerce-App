import React, { useContext } from 'react';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import './css/CartTotal.css';

const CartTotal = () => {

  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className='cart-total'>

      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}

      <div className='cart-total-header'>

        <div className='cart-total-title'>
          <Title
            text1={'CART'}
            text2={'TOTALS'}
          />
        </div>

        <span className='cart-total-header-line'></span>

      </div>


      {/* ============================== */}
      {/* SUMMARY */}
      {/* ============================== */}

      <div className='cart-total-summary'>

        {/* SUBTOTAL */}

        <div className='cart-total-row'>

          <div className='cart-total-label'>
            <span className='cart-total-dot'></span>

            <p>Subtotal</p>
          </div>

          <p className='cart-total-price'>
            {currency}
            {getCartAmount()}.00
          </p>

        </div>


        <div className='cart-total-separator'></div>


        {/* SHIPPING */}

        <div className='cart-total-row'>

          <div className='cart-total-label'>
            <span className='cart-total-dot'></span>

            <p>Shipping Fee</p>
          </div>

          <p className='cart-total-price'>
            {currency}
            {delivery_fee}.00
          </p>

        </div>


        <div className='cart-total-separator'></div>


        {/* TOTAL */}

        <div className='cart-total-final'>

          <div className='cart-total-final-label'>

            <span className='cart-total-small-label'>
              AMOUNT PAYABLE
            </span>

            <b>
              Total
            </b>

          </div>

          <b className='cart-total-final-price'>
            {currency}
            {getCartAmount() === 0
              ? 0
              : getCartAmount() + delivery_fee}
            .00
          </b>

        </div>

      </div>


      {/* ============================== */}
      {/* SECURE CHECKOUT NOTE */}
      {/* ============================== */}

      <div className='cart-total-footer'>

        <span className='cart-total-footer-icon'>
          ✓
        </span>

        <p>
          Secure checkout · Fast delivery ·
          Easy returns
        </p>

      </div>

    </div>
  );
};

export default CartTotal;