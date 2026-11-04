import { Component, inject, ViewChild,OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexXAxis,
  ApexAxisChartSeries
} from 'ng-apexcharts';
import { NPersonasXTipoDocumento } from '../../../model/api/response/npersonas-xtipo-documento';
import { PersonaService } from '../../../services/persona.service';

export type ChartOptionsPie = {
  title: ApexTitleSubtitle;
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
};

export type ChartOptionsBar = {
  title: ApexTitleSubtitle;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  colors: string[];
  plotOptions: any;
};

@Component({
  selector: 'app-chart-persona',
  imports: [NgApexchartsModule],
  templateUrl: './chart-persona.html',
  styleUrl: './chart-persona.scss',
})
export class ChartPersona implements OnInit{
    private NPersonasXTipoDocumento: NPersonasXTipoDocumento[] = [];
    private personaService = inject(PersonaService);

    @ViewChild('chart') chart!: ChartComponent;
    public chartOptionsPie: Partial<ChartOptionsPie> = {};
    public chartOptionsBar: Partial<ChartOptionsBar> = {};

    ngOnInit(): void {
      this.getNPersonasXTipoDocumentoPie();
      this.getNPersonasXTipoDocumentoBar();
    }

    private getRandomColors(count: number): string[] {
      const colors = [];
      //Math.random() devuelve aleatorio entre 0 y 1
      //Math.random() * 16777215 donde 16777215 = FFFFFF hexadecimal
      //Math.floor(8954234.87)=8954234, elimina decimales
      //toString(16): Convierte a hexadecimal
      //padStart(6, '0'): Rellena con ceros hasta completar con 6 caracteres
      for (let i = 0; i < count; i++) {
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        colors.push(color);
      }
      return colors;
    }

    getNPersonasXTipoDocumentoPie(): void {
      this.personaService.getNPersonasXTipoDocumento().subscribe({
        next: (data: NPersonasXTipoDocumento[]) => {
          this.chartOptionsPie = {
            title: {
              text: "Cantidad de Personas por Tipo de Documento",
              align: 'center',
              style: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333'
              }
            },
            series: data.map((d) => d.cantidad),
            labels: data.map((d) => d.descripcion),
            colors: this.getRandomColors(data.length),
            chart: {
              type: 'pie',
              width: 500,
              height: 500
            },
            responsive: [
              {
                breakpoint: 1400,
                options: {
                  chart: { width: 300, height: 300 },
                  legend: { position: 'bottom' },
                  title: { style: { fontSize: '18px' } }
                },
              },
              {
                breakpoint: 992,
                options: {
                  chart: { width: 200, height: 200 },
                  legend: { position: 'bottom' },
                  title: { style: { fontSize: '18px' } }
                },
              },
            ],
          };
        },
        error: (err) => {
          console.error('Error al obtener los datos', err);
        },
      });
    }

    getNPersonasXTipoDocumentoBar(): void {
      this.personaService.getNPersonasXTipoDocumento().subscribe({
        next: (data: NPersonasXTipoDocumento[]) => {
          this.chartOptionsBar = {
            title: {
              text: "Cantidad de Personas por Tipo de Documento",
              align: 'center',
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
              }
            },
            series: [
              {
                name: 'Cantidad',
                data: data.map((d) => d.cantidad)
              }
            ],
            xaxis: {
              categories: data.map((d) => d.descripcion)
            },
            colors: this.getRandomColors(data.length),
            plotOptions: {//cada barra tenga un color distinto dentro de una misma serie de datos
              bar: {
                distributed: true
              }
            },
            chart: {
              type: 'bar',
              height: 500,
              width: '150%'
            },
          };
        },
        error: (err) => {
          console.error('Error al obtener los datos', err);
        },
      });
    }
}
