import { createRouter } from "@/common/util/create-router";
import { register } from "../routes/business.routes";
import { BusinessService } from "@/business/business.service";
import { BusinessRepository } from "@/data-access/business.repository";
import { Client, Pool } from "pg";

const businessRepository = new BusinessRepository(
  new Pool({
    port: 5432,
    host: "localhost",
    user: "test",
    password: "test",
    database: "review_wise_db",
  }),
);
const businessService = new BusinessService(businessRepository);

export const BusinessController = createRouter().openapi(
  register,
  async (c) => {
    const body = c.req.valid("json");

    const businessId = await businessService.registerBusiness(body);

    return c.json(
      {
        businessId,
      },
      201,
    );
  },
);
