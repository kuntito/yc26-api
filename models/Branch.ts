import { BranchEntity } from "../schemas/branch-schema";

export type Branch = {
    branchId: number;
    branchName: string;
}

export const toBranchFromEntity = (
    branchEntity: BranchEntity,
): Branch => {
    return {
        branchId: branchEntity.branchId,
        branchName: branchEntity.branchName,
    }
}