// src/core/repositories/IHomePageRepository.ts
import { HomepageEntity } from "../entities/HomePage.entity";
import { UpdateHomepageDTO } from "../dtos/HomePage.dto";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { HomePageSection } from "../entities/HomePage.entity";
export interface IHomePageRepository {
  getHomePage(): Promise<HomepageEntity | null>;
  updateHomepage(data: UpdateHomepageDTO): Promise<HomepageEntity>;
}


// This type represents the raw structure returned by Prisma for your HomePage model
// It includes the JsonValue type for 'sections'
type PrismaHomePage = Prisma.HomePageGetPayload<{}>;


export class HomePageRepository implements IHomePageRepository {
  private mapPrismaHomePageToHomePageEntity(prismaHomePage: PrismaHomePage): HomepageEntity {
    return {
      id: prismaHomePage.id,
      sections: prismaHomePage.sections as unknown as HomePageSection[],
      createdAt: prismaHomePage.createdAt,
      updatedAt: prismaHomePage.updatedAt,
    };
  }

  async getHomePage(): Promise<HomepageEntity | null> {
    let homePageRecord: PrismaHomePage | null;
    try {
      homePageRecord = await prisma.homePage.findFirst();

      if (!homePageRecord) {
        console.log("No homepage content found, creating a default empty record.");
        homePageRecord = await prisma.homePage.create({
          data: {
            sections: [], // This is a valid JsonArray
          },
        });
        console.log("Default homepage record created successfully.");
      }
    } catch (error) {
      console.error("Error fetching or creating homepage content:", error);
      return null;
    }

    // Map the raw Prisma record to the strongly-typed HomepageEntity before returning
    // We already handled `homePageRecord` being null above.
    return this.mapPrismaHomePageToHomePageEntity(homePageRecord);
  }

  async updateHomepage(data: UpdateHomepageDTO): Promise<HomepageEntity> {
    const existingHomepage = await this.getHomePage();

    if (!existingHomepage) {
      throw new Error("Failed to retrieve or create homepage record for update operation.");
    }

    try {
      const updatedPrismaHomepage = await prisma.homePage.update({
        where: { id: existingHomepage.id },
        data: {
          // CORRECTED: Cast data.sections to unknown first, then to Prisma.JsonArray
          sections: data.sections as unknown as Prisma.JsonArray,
        },
      });
      // Map the updated raw Prisma record to the strongly-typed HomepageEntity before returning
      return this.mapPrismaHomePageToHomePageEntity(updatedPrismaHomepage);
    } catch (error) {
      console.error(`Error updating homepage content with ID ${existingHomepage.id}:`, error);
      throw new Error(`Failed to update homepage content: ${(error as Error).message || 'An unknown error occurred.'}`);
    }
  }
}