import { ClassGeneric } from "../util/ClassGeneric";
export interface Modulo extends ClassGeneric{
  idMod: number;
  descripcion: string;
  url: string;
  activo: boolean;
  ordenOpcion: number;
}
