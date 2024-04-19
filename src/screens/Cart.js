import React from 'react'
import{useState} from 'react'


import Delete from '@mui/icons-material/Delete'
import { useCart, useDispatchCart } from '../components/ContextReducer';
import App from '../App';
import axios from 'axios';
import Stripe from "react-stripe-checkout";
export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();
  let [canCheckout,setCanCheckout]=useState(false);

  const handleToken = (totalAmount, token) => {
    try {
      axios.post("http://localhost/api/stripe/pay", {

        token: token.id,
        amount: totalAmount
      });
      setCanCheckout(true);
    } catch (error) {
      console.log(error);
    };
  }

  const tokenHandler = (token) => {
    handleToken(100, token);
  }
  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
      </div>
    )
  }
  // const handleRemove = (index)=>{
  //   console.log(index)
  //   dispatch({type:"REMOVE",index:index})
  // }

  const handleCheckOut = async () => {
    if(canCheckout){

      let userEmail = localStorage.getItem("userEmail");
      // console.log(data,localStorage.getItem("userEmail"),new Date())
      let response = await fetch(`${process.env.REACT_APP_API_END_POINT}/api/auth/orderData`, {
        // credentials: 'include',
        // Origin:"http://localhost:3000/login",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString()
        })
      });
      console.log("JSON RESPONSE:::::", response.status)
      if (response.status === 200) {
        dispatch({ type: "DROP" })
      }
    }
  }

  let totalPrice = data.reduce((total, food) => total + food.price, 0)
  return (
    <div>

      {console.log(data)}
      <div className='container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md' >
        <table className='table table-hover'>
          <thead className=' text-success fs-4'>
            <tr>
              <th scope='col' >#</th>
              <th scope='col' >Name</th>
              <th scope='col' >Quantity</th>
              <th scope='col' >Option</th>
              <th scope='col' >Amount</th>
              <th scope='col' >Date</th>
              <th scope='col' >Custom</th>

              <th scope='col' ></th>
            </tr>
          </thead>
          <tbody className='text-white'>
            {data.map((food, index) => (
              <tr>
                <th scope='row' >{index + 1}</th>
                <td >{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>{food.nextweekday}</td>
                <td>{food.custom?food.custom:"no custom"}</td>

                <td ><button type="button" className="btn p-0"><Delete onClick={() => { dispatch({ type: "REMOVE", index: index }) }} /></button> </td></tr>
            ))}
          </tbody>
        </table>
        <div ><h1 className='fs-2 text-white'>Total Price: {totalPrice}/-</h1></div>
        <div>
          <button className='btn bg-success mt-5 ' onClick={handleCheckOut} > Check Out </button>
        </div>
        <div>
          <Stripe
            stripeKey="pk_test_51OsRynSBbgvHZD8X62iwjoAVTHsOsZ4Tr7kbmvVyRdL5qHFq5jQ8OJSn9NuTr6B23ypPKNtgAe5usR8dR35cAs1x00aBPexUMW"
            token={tokenHandler}
          />
        </div>
      </div>



    </div>
  );
}

