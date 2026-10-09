import { Component,OnInit,ChangeDetectorRef,inject } from '@angular/core';
import { PersonaRequest } from '../../../model/api/request/persona-request';
import { PersonaResponse } from '../../../model/api/response/persona-response';
import { PersonaService } from '../../../services/persona.service';
import { ReactiveFormsModule, FormControl,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SexoService } from '../../../services/sexo.service';
import { Sexo } from '../../../model/sexo';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoDocumento } from '../../../model/tipo-documento';
import { UbigeoService } from '../../../services/ubigeo.service';
import { Ubigeo } from '../../../model/ubigeo';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-registrar-persona',
  imports: [ReactiveFormsModule,CommonModule, NgxPaginationModule],
  templateUrl: './registrar-persona.html',
  styleUrl: './registrar-persona.scss',
})
export class RegistrarPersona implements OnInit{
  private personaService=inject(PersonaService);
  private sexoService=inject(SexoService);
  private tipoDocumentoService=inject(TipoDocumentoService);
  private ubigeoService=inject(UbigeoService);
  private cdr=inject(ChangeDetectorRef);

  title='Registrar Persona';
  personaArray:PersonaResponse[]=[];
  personaRequest:PersonaRequest={} as PersonaRequest;
  sexoArray:Sexo[]=[];
  tipoDocumentoArray:TipoDocumento[]=[];
  ubigeoArray:Ubigeo[]=[];
  page:number=1;
  personaForm:FormGroup;
  isEdited: boolean=false;
  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  constructor(){
    this.personaForm=new FormGroup({
      idPersona:new FormControl(''),
      apellidoPaterno:new FormControl('',Validators.required),
      apellidoMaterno:new FormControl('',Validators.required),
      nombres:new FormControl('',Validators.required),
      idSexo:new FormControl('',Validators.required),
      fechaNacimiento:new FormControl('',Validators.required),
      idTipoDocumento:new FormControl('',Validators.required),
      numDocumento:new FormControl('',Validators.required),
      telefono:new FormControl('',Validators.required),
      direccion:new FormControl('',Validators.required),
      idDepartamento:new FormControl('',Validators.required),
      idProvincia:new FormControl('',Validators.required),
      idDistrito:new FormControl('',Validators.required),
    })
  }

  ngOnInit(): void {
    this.isEdited=false;
    this.getSexo();
    this.getTipoDocumento();
    this.getUbigeo();
    this.getPersonas();
    this.setFormValuesIni();
  }

  getPersonas():void {
    this.personaService.getPersonas().subscribe((result:PersonaResponse[])=>{
      //console.log('getPersonas:',result);
      this.personaArray=result;
      this.cdr.detectChanges();
    });
  }

  getSexo():void {
    this.sexoService.getSexo().subscribe((result:Sexo[])=>{
      this.sexoArray=result;
      this.cdr.detectChanges();
    });
  }

  getTipoDocumento():void {
    this.tipoDocumentoService.getTipoDocumento().subscribe((result:TipoDocumento[])=>{
      this.tipoDocumentoArray=result;
      this.cdr.detectChanges();
    });
  }

  //idUbigeo->aabbcc =150101 donde aa:codigo del departamento bb:codigo de la provincia cc:codigo del distrito
  filterProvincias(idDepartamento: string | undefined): void {
    if (idDepartamento && idDepartamento.length >= 2) {
      const prefix = idDepartamento.substring(0, 2); // aa
      this.provincias = this.ubigeoArray
        .filter(u => u.idUbigeo.startsWith(prefix) &&
                     u.idUbigeo.substring(4, 6) === '01')
        .sort((a, b) => a.provincia.localeCompare(b.provincia));
    } else {
      this.provincias = [];
    }
  }

  filterDistritos(idProvincia: string | undefined): void {
    if (idProvincia && idProvincia.length >= 4) {
      const prefix = idProvincia.substring(0, 4); // aabb
      this.distritos = this.ubigeoArray
        .filter(u => u.idUbigeo.startsWith(prefix) &&
                     u.distrito && u.distrito.trim() !== '')
        .sort((a, b) => a.distrito.localeCompare(b.distrito));
    } else {
      this.distritos = [];
    }
  }

  onDepartamentoChange(): void {
    const idDep = this.personaForm.get('idDepartamento')?.value;
    this.filterProvincias(idDep);
    this.distritos = [];
    this.personaForm.patchValue({ idProvincia: '', idDistrito: '' });
  }

  onProvinciaChange(): void {
    const idProv = this.personaForm.get('idProvincia')?.value;
    this.filterDistritos(idProv);
    this.personaForm.patchValue({ idDistrito: '' });
  }

  getUbigeo():void {
    this.ubigeoService.getUbigeo().subscribe((result:Ubigeo[])=>{
      this.ubigeoArray=result;
      this.departamentos = result
        .filter(u => u.idUbigeo.substring(2, 6) === '0000')
        .sort((a, b) => a.departamento.localeCompare(b.departamento));

      if (!this.isEdited) {
        this.setUbigeoDefault();
      }
      this.cdr.detectChanges();
    });
  }

  setUbigeoDefault() {
    const idDepDefault = '150000'; // Lima Departamento
    this.filterProvincias(idDepDefault);
    const idProvDefault = '150101'; // Lima Provincia (regla 01)
    this.filterDistritos(idProvDefault);
    const idDistDefault = '150101';

    this.personaForm.patchValue({
      idDepartamento: idDepDefault,
      idProvincia: idProvDefault,
      idDistrito: idDistDefault
    });
  }


  setPersonaRequest():void{
    this.personaRequest.idPersona=this.personaForm.get('idPersona')?.value;
    this.personaRequest.apellidoPaterno=this.personaForm.get('apellidoPaterno')?.value;
    this.personaRequest.apellidoMaterno=this.personaForm.get('apellidoMaterno')?.value;
    this.personaRequest.nombres=this.personaForm.get('nombres')?.value;
    this.personaRequest.idSexo=this.personaForm.get('idSexo')?.value;
    this.personaRequest.fechaNacimiento=this.personaForm.get('fechaNacimiento')?.value;
    this.personaRequest.idTipoDocumento=this.personaForm.get('idTipoDocumento')?.value;
    this.personaRequest.numDocumento=this.personaForm.get('numDocumento')?.value;
    this.personaRequest.telefono=this.personaForm.get('telefono')?.value;
    this.personaRequest.direccion=this.personaForm.get('direccion')?.value;
    this.personaRequest.idUbigeo=this.personaForm.get('idDistrito')?.value;
  }

  setFormValuesIni(){
    this.personaForm.patchValue({
      idSexo:'I',
      idTipoDocumento:1,
      idUbigeo:'150101'
    });
    this.setUbigeoDefault();
  }

  refreshForm(){
    this.getPersonas();
    this.personaForm.reset();
    this.isEdited=false;
    this.setFormValuesIni();
  }

  registrarPersona():void{
    this.setPersonaRequest();
    if(this.isEdited) this.actualizarPersona();
    else this.insertarPersona();

  }

  insertarPersona():void{
    Swal.fire({
      title:'Esta seguro de registrar los datos de la persona',
      showCancelButton:true,
      cancelButtonText:'No',
      confirmButtonText:'Si',
      confirmButtonColor:'#000080',
      cancelButtonColor:'#b5b4b4',
      focusCancel:true,
    }).then((result)=>{
      if(result.isConfirmed){
        this.personaService.registrarPersona(this.personaRequest).subscribe(
        (result:PersonaResponse)=>{
          console.log('registrarPersona:',result);
          this.refreshForm();
          Swal.fire({
            icon:'success',
            title:'registrarPersona...',
            text:'!Se registro exitosamente los datos de la persona!',
            confirmButtonColor:'#000080',
          })
        },
        (err:HttpErrorResponse)=>{
          console.log(err.error.message);
          Swal.fire({
            icon:'error',
            title:'registrarPersona...',
            text:'!Ah ocurrido un error al registrar datos de la persona!',
            confirmButtonColor:'#b5b4b4',
          })
        }
      )
      }

    })

  }

  actualizarPersona():void{
    console.log('actualizarPersona:',this.personaRequest);
    this.personaService.actualizarPersona(this.personaRequest).subscribe(
      (result:PersonaResponse)=>{
          console.log('actualizarPersona:',result);
          this.refreshForm();
          Swal.fire({
            icon:'success',
            title:'actualizarPersona...',
            text:'!Se actualizó exitosamente los datos de la persona!',
            confirmButtonColor:'#000080',
          })
        },
        (err:HttpErrorResponse)=>{
          console.log(err.error.message);
          Swal.fire({
            icon:'error',
            title:'actualizarPersona...',
            text:'!Ah ocurrido un error al actualizar los datos de la persona!',
            confirmButtonColor:'#b5b4b4',
          })
        }
    )
  }

  editarPersona(persona: PersonaResponse):void{
    Swal.fire({
      title:'Esta seguro de editar los datos de la persona',
      showCancelButton:true,
      cancelButtonText:'No',
      confirmButtonText:'Si',
      confirmButtonColor:'#000080',
      cancelButtonColor:'#b5b4b4',
      focusCancel:true,
    }).then((result)=>{
      if(result.isConfirmed){
        const idUbigeo = persona?.ubigeo?.idUbigeo || '';
        let idDep = '';
        let idProv = '';
        let idDist = '';

        if (idUbigeo.length === 6) {
          idDep = idUbigeo.substring(0, 2) + '0000';
          idProv = idUbigeo.substring(0, 4) + '01';
          idDist = idUbigeo;

          this.filterProvincias(idDep);
          this.filterDistritos(idProv);
        }

        this.personaForm.patchValue({
          idPersona: persona.idPersona,
          apellidoPaterno: persona.apellidoPaterno,
          apellidoMaterno: persona.apellidoMaterno,
          nombres: persona.nombres,
          idSexo: persona?.sexo?.idSexo,
          fechaNacimiento: persona.fechaNacimiento,
          idTipoDocumento: persona?.tipoDocumento?.idTipoDocumento,
          numDocumento: persona.numDocumento,
          telefono: persona.telefono,
          direccion: persona.direccion,
          idDepartamento: idDep,
          idProvincia: idProv,
          idDistrito: idDist,
        });
        this.isEdited = true;
      }
    })
  }

  eliminarPersona(persona:PersonaResponse):void {
    Swal.fire({
      title:'Esta seguro de eliminar los datos de la persona',
      showCancelButton:true,
      cancelButtonText:'No',
      confirmButtonText:'Si',
      confirmButtonColor:'#000080',
      cancelButtonColor:'#b5b4b4',
      focusCancel:true,
    }).then((result)=>{
      if(result.isConfirmed){
        const request:PersonaRequest={...this.personaRequest,idPersona:persona.idPersona}
        this.personaService.eliminarPersona(request).subscribe(
          (result:PersonaResponse)=>{
            console.log('eliminarPersona:',result);
            this.refreshForm();
            Swal.fire({
              icon:'success',
              title:'eliminarPersona...',
              text:'!Se eliminó exitosamente los datos de la persona!',
              confirmButtonColor:'#000080',
            })
          },
          (err:HttpErrorResponse)=>{
            console.log(err.error.message);
            Swal.fire({
              icon:'error',
              title:'eliminarPersona...',
              text:'!Ah ocurrido un error al eliminar los datos de la persona!',
              confirmButtonColor:'#b5b4b4',
            })
          }
      )
      }
    })
  }
}
