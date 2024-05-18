export interface IPatient {
    id?: number;
    DNI: string;
    Nombre: string;
    Apellido: string;
    CorreoElectronico: string;
    Telefonos: string | null;
    FechaNacimiento: string;
    Direccion: string | null;
    CiudadID: number | null;
}