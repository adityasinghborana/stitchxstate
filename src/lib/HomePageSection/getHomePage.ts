
import { HomePageApiRepository } from "@/infrastructure/frontend/repositories/HomePage.api";
import { HomePageUseCases } from "@/core/usecases/HomePage.usecase";
import { HomepageEntity } from "@/core/entities/HomePage.entity";

const homepageRepository = new HomePageApiRepository();
const homepageUseCases = new HomePageUseCases(homepageRepository);

export const getHomePage = async (): Promise<HomepageEntity | null> => {
  try {
    return await homepageUseCases.getHomepage();
  } catch (error) {
    console.error("Error fetching homepage in getHomePage lib function:", error);
    // In a real application, you might want to return a default/fallback homepage entity
    // or re-throw if it's a critical error that should block rendering.
    return null;
  }
};