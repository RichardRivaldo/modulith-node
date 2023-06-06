export interface AddCuisineRequestDTO {
    name: string;
    price: number;
}

export interface ChangeCuisineRequestDTO {
    name: string;
    price: number;
    isActive: boolean;
}
