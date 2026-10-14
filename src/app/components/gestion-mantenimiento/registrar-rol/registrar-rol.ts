import { Component, OnInit, TemplateRef, ViewChild,inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { RolResponse } from '../../../model/api/response/RolResponse';
import { RolRequest } from '../../../model/api/request/RolRequest';
import { RolService } from '../../../services/rol.service';
import { RegexConstants } from '../../../util/constant';
import { setListRow } from '../../../util/methods';
import { ModuloService } from '../../../services/modulo.service';
import { Modulo } from '../../../model/modulo';

@Component({
  selector: 'app-registrar-rol',
  imports: [CommonModule,
    NgxDatatableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule],
  templateUrl: './registrar-rol.html',
  styleUrl: './registrar-rol.scss',
})
export class RegistrarRol implements OnInit{
  public RG = RegexConstants;

listModulo: Modulo[] = [];

  result: RolResponse[] = [];
  filter: RolRequest = new RolRequest();
  record: RolRequest = new RolRequest();
  columns: any[] = [];

  @ViewChild('colAccionTemplate', { static: true }) colAccionTemplate!: TemplateRef<any>;
  @ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  private dialog=inject(MatDialog);
  private service=inject(RolService);
  private moduloService=inject(ModuloService);

  ngOnInit() {
    forkJoin({
      resultModulo: this.moduloService.list({})
    }).subscribe({
      next: ({ resultModulo }) => {
        this.listModulo = resultModulo;
        this.search();
      },
      error: (err) => {
        Swal.close();
        Swal.fire({
          icon: 'warning',
          title: '¡Advertencia!',
          text: err.error,
        });
      }
    });
  }
  cleanSearch() {
    this.filter = new RolRequest();
    this.search();
  }

  search() {
    forkJoin({
      resultResponse: this.service.list(this.filter)
    }).subscribe({
      next: ({ resultResponse }) => {
        console.log(resultResponse);
        this.result = [...setListRow(resultResponse)];
        this.initTable();
      },
      error: (err) => {
        Swal.close();
        Swal.fire({
          icon: 'warning',
          title: '¡Advertencia!',
          text: err.error,
        });
      }
    });
  }

  openAdd() {
    this.record = new RolRequest();
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '400px'
    });
  }

  openEdit(value: RolResponse) {
    forkJoin({
      resultResponse: this.service.find({ idRol: value.idRol })
    }).subscribe({
      next: ({ resultResponse }) => {
        this.record = resultResponse;
        this.dialogRef = this.dialog.open(this.dialogTemplate, {
          width: '400px'
        });
      },
      error: (err) => {
        Swal.close();
        Swal.fire({
          icon: 'warning',
          title: '¡Advertencia!',
          text: err.error,
        });
      }
    });
  }

  save() {
    if (!this.record.descripcion || !this.record.codigo) {
      Swal.fire({
        icon: 'warning',
        title: 'Debe ingresar todos los valores obligatorios',
      });
      return;
    }
    this.service.save(this.record).subscribe(
      (result: RolResponse) => {
        this.search();
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: this.record.idRol ? 'Actualización Exitosa' : 'Registro Exitoso',
          text: 'El rol ' + result.descripcion + ' fue ' + (this.record.idRol ? 'actualizado' : 'registrado'),
        });
        this.dialogRef.close();
      },
      (err: any) => {
        Swal.close();
        Swal.fire({
          icon: 'warning',
          title: '¡Advertencia!',
          text: err.error,
        });
      }
    );
  }

  delete(value: RolResponse) {
    Swal.fire({
      title: '¿Está seguro de eliminar el rol seleccionado?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete({ idRol: value.idRol }).subscribe(
          (result: RolResponse) => {
            this.search();
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Eliminación Exitosa',
              text: 'El rol ' + result.descripcion + ' fue eliminado',
            });
          },
          (err: any) => {
            Swal.close();
            Swal.fire({
              icon: 'warning',
              title: '¡Advertencia!',
              text: err.error,
            });
          }
        );
      }
    });
  }

  initTable() {
    this.columns = [
      { name: 'Nro.', prop: 'row', width: 40 },
      { name: 'Código', prop: 'codigo' },
      { name: 'Nombre', prop: 'descripcion' },
      { name: 'Acciones', cellTemplate: this.colAccionTemplate, width: 80 }
    ];
  }

}
