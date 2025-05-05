import type { GetBusinessByIdPort } from "@/ports/input/business/get-business-by-id.port";
import type { RegisterBusinessPort } from "@/ports/input/business/register-business.port";
import type { RemoveBusiness } from "@/ports/input/business/remove-business.port";

export interface BusinessApiPort
	extends RegisterBusinessPort,
		GetBusinessByIdPort,
		RemoveBusiness {}
