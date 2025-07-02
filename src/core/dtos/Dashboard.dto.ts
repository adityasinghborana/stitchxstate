import { orderEntity } from "../entities/order.entity";
import { ProductVariationEntity } from "../entities/product.entity";
export interface DashboardDto{
    totalSales:number;
    totalOrders:number;
    totalPurchase:number;
    totalGrowth:{
        revenueGrowth:string;
        orderGrowth:string;
    }
    totalUsers:number;
    stockAlerts:Pick<ProductVariationEntity,  'id' | 'stock' | 'createdAt'>[];
    totalProducts:number;
    totalcategories:number;
    totalRevenue:number;
    mostViewedProduct: { id: string; name: string; views: number } | null; 
    recentOrders: Pick<orderEntity, 'id'  | 'items' | 'status' | 'createdAt'>[];
    topProducts: { id: string; name: string; totalRevenue: number }[];
    orderStatusBreakdown: Record<string, number>;
    trafficSources: Record<string, number>; 
}