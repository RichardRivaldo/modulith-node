export interface AddRestaurantRequestDTO {
    name: string;
    address: string;
    phoneNumber: string;
}

export interface ChangeRestaurantRequestDTO {
    name: string;
    address: string;
    phoneNumber: string;
    isActive: boolean;
}
