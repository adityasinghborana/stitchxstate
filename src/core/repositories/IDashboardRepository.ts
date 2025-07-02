import prisma from "@/lib/prisma";
import { orderEntity } from "../entities/order.entity";
import { ProductVariationEntity } from "../entities/product.entity";
import { OrderItemEntity } from "../entities/order.entity";
import { DashboardDto } from "../dtos/Dashboard.dto";
interface TopProductData {
  id: string;
  name: string;
  totalRevenue: number;
  quantitySold: number;
}

interface StockAlertData {
  id: string;
  name: string;
  stock: number;
}
export interface IDashboardRepository{
    getSalesAndOrderSummary(): Promise<{ totalSales: number; totalOrders: number }>;
    getRecentOrders(take?: number): Promise<Pick<orderEntity, 'id' | 'items' | 'createdAt'>[]>;
    getTopSellingProducts(take?: number): Promise<TopProductData[]>;
    getOrderStatusBreakdown(): Promise<Record<string, number>>;
    getTotalProductsCount(): Promise<number>;
    getTotalCategoriesCount(): Promise<number>;
    getTotalUsersCount(): Promise<number>;
    getTotalItemsSold(): Promise<number>;
    getGrowthMetrics(): Promise<{ revenueGrowth: string; orderGrowth: string }>;
    getLowStockAlerts(threshold: number): Promise<Pick<ProductVariationEntity,'id'|'price'|'createdAt'|'stock'>[]>;
}
export class DashboardRepository implements IDashboardRepository{
    async getSalesAndOrderSummary(): Promise<{ totalSales: number; totalOrders: number; }> {
        const salesData= await prisma.order.aggregate({
            _sum:{total:true},
            _count:{id:true}
        });
        return {
            totalSales: salesData._sum.total|| 0,
            totalOrders: salesData._count.id || 0,
    };  
    }
    async getRecentOrders(take: number = 5): Promise<any[]> {
        return prisma.order.findMany({
            orderBy:{createdAt:'desc'},
            take:take,
            select:{id:true,orderItems:true,total:true,status:true,createdAt:true}
        })
    }
    async getTopSellingProducts(take: number=5): Promise<TopProductData[]> {
        const topProductsRaw= await prisma.orderItem.groupBy({
            by:['productVariationId'],
            _sum:{
                quantity:true,
                price:true,
            },
            orderBy:{
                _sum:{
                    price:'desc'
                }
            },
            take:take
        });
        const topProductsIds=topProductsRaw.map(item=>item.productVariationId);
        const topProductDetails= await prisma.product.findMany({
            where:{id:{in:topProductsIds}},
            select:{id:true,name:true}
        })
        return topProductsRaw.map(item=>({
            id:item.productVariationId,
            name:topProductDetails.find(p=>p.id === item.productVariationId)?.name ||'Unknown Product',
            totalRevenue:item._sum.price || 0,
            quantitySold:item._sum.quantity ||0
        }))
    }
    async getOrderStatusBreakdown(): Promise<Record<string, number>> {
        const orderStatuscounts= await prisma.order.groupBy({
            by:['status'],
            _count:{id:true}
        });
        return orderStatuscounts.reduce((acc,item)=>{
            acc[item.status]=item._count.id;
            return acc;

        },{}as Record<string, number>)
        
    }
    async getTotalProductsCount(): Promise<number> {
        return prisma.product.count()
    }
    async getTotalCategoriesCount(): Promise<number> {
        return prisma.category.count()
    }
    async getTotalUsersCount(): Promise<number> {
        return prisma.user.count();
    }
    async getTotalItemsSold(): Promise<number> {
        const totalItemsSoldData = await prisma.orderItem.aggregate({
            _sum:{quantity:true}
        })
        return totalItemsSoldData._sum.quantity || 0
    }
    async getGrowthMetrics(): Promise<{ revenueGrowth: string; orderGrowth: string; }> {
        const now= new Date();
        const currentMonthStart= new Date(now.getFullYear(),now.getMonth(),1);
        const lastMonthstart= new Date(now.getFullYear(),now.getMonth()-1,1);
        const lastMonthend= new Date(now.getFullYear(),now.getMonth(),0);
        const currentMonthSalesData = await prisma.order.aggregate({
            _sum:{total:true},
            _count:{id:true},
            where:{createdAt:{gte:currentMonthStart}}
        });
        const currentMonthSale=currentMonthSalesData._sum.total || 0;
        const currentMonthOrder= currentMonthSalesData._count.id ||0;
        const lastMonthSaleData= await prisma.order.aggregate({
            _sum:{total:true},
            _count:{id:true},
            where:{createdAt:{gte:lastMonthstart,lte:lastMonthend}}
        });
        const lastMonthSales = lastMonthSaleData._sum.total || 0;
        const lastMonthOrders = lastMonthSaleData._count.id || 0;
        const calculateGrowth = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? '+Inf%' : '0%';
            const growth = ((current - previous) / previous) * 100;
            return `${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%`;
        };
        const revenueGrowth = calculateGrowth(currentMonthSale, lastMonthSales);
        const orderGrowth = calculateGrowth(currentMonthOrder, lastMonthOrders);
        return { revenueGrowth, orderGrowth };
    }
    async getLowStockAlerts(threshold: number): Promise<Pick<ProductVariationEntity, "id" | "price" | "createdAt"|"stock">[]> {
        return prisma.productVariation.findMany({
            where:{stock:{lte:threshold}},
            select:{id:true,price:true,stock:true,createdAt:true},
            orderBy:{stock:'asc'}
        })
    }

}