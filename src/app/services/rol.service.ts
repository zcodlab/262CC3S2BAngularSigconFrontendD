import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { RolRequest } from '../model/api/request/RolRequest';
import { RolResponse } from '../model/api/response/RolResponse';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }

  list(filter: RolRequest): Observable<RolResponse[]> {
    return this.http.post<RolResponse[]>(`${environment.url}/rol/list`, filter);
  }

  find(filter: RolRequest): Observable<RolResponse> {
    return this.http.post<RolResponse>(`${environment.url}/rol/find`, filter);
  }

  save(filter: RolRequest): Observable<RolResponse> {
    return this.http.post<RolResponse>(`${environment.url}/rol/save`, filter);
  }

  delete(filter: RolRequest): Observable<RolResponse> {
    return this.http.delete<RolResponse>(`${environment.url}/rol/delete`, {
      body: filter
    });
  }

}
