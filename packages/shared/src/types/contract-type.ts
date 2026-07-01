export enum ContractType {
  EMPLOYMENT = 'Umowa o pracę',
}

export const CONTRACT_TYPE_OPTIONS: readonly ContractType[] = Object.values(ContractType)

export const getContractTypeLabel = (contractType: ContractType): string => contractType
