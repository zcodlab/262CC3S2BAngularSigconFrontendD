import { ClassGeneric } from "../../../util/ClassGeneric";
export class RolResponse extends ClassGeneric{
    id?: number;
    codigo?: string;
    descripcion?: string;
    activo?: boolean;
    paginas: number[] = [];
}
