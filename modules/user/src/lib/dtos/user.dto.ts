export interface LoginRequestDTO {
    phoneNumber: string;
    password: string;
}

export interface ChangeRequestDTO {
    currentPassword: string;
    name?: string;
    phoneNumber?: string;
    password?: string;
}
