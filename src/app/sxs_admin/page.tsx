import Dashboard from "./(_component)/Dashboard";
import { DashboarduseCase } from "@/core/usecases/Dashboard.usecase";
import { DashboardRepository } from "@/core/repositories/IDashboardRepository";
import { PrismaUserRepository } from "@/core/repositories/IUserRepository";
export default async function AdminDashboard() {
    const userRepository = new PrismaUserRepository()
    const dashboardRepository=new DashboardRepository(userRepository);
    const dashboardUsecase = new DashboarduseCase(dashboardRepository);
    const dashboardData = await dashboardUsecase.execute()
  return (
    <Dashboard dashboardData={dashboardData}/>
  );
}
