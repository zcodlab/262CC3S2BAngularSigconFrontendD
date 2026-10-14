import { Injectable ,inject} from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Modulo } from '../model/modulo';

@Injectable({
    providedIn: 'root'
})
export class ModuloService {
    private http=inject(HttpClient)

    list(filter: Partial<Modulo>): Observable<Modulo[]> {
        return this.http.post<Modulo[]>(`${environment.url}/modulo/list`, filter);
    }




}
