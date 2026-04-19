import type { ExternalApplicationStatus } from "../../client/types.gen";

export const EXTERNAL_APPLICATION_STATUS_TO_NAME: Record<
  ExternalApplicationStatus,
  string
> = {
  new: "Заявка создана",
  managerAssigned: "Назначен руководитель",
  rejectedByProjectOffice: "Отклонена проектным офисом",
  approvedByManager: "Заявка принята",
  rejectedByManager: "Отклонена руководителем",
};
