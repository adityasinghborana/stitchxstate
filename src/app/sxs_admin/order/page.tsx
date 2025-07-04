import React from "react"
import OrderListTable from "./(_component)/orderListTable"
import { orderEntity } from "@/core/entities/order.entity"
import { OrderApiRepository } from "@/infrastructure/frontend/repositories/OrderRepository.api"
const page = async () => {
  
    const orderRepository= new OrderApiRepository();
    let order:orderEntity[]=[];
    try {
        order = await orderRepository.findAll();
    } catch (error) {
        error =  'Failed to load order.';
    }
  return (
    <div>
        <OrderListTable order={order}/>
    </div>
  )
}

export default page