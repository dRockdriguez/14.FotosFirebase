import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { CargaImagenesService } from '../../services/carga-imagenes.service';


@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: []
})
export class CargaComponent implements OnInit {

  archivos:FileItem[] = [];
  estaDrop: boolean = false;

  constructor(
    private _cargaServ: CargaImagenesService
  ) { }

  ngOnInit() {
  }

  cargarImagen(){
    this._cargaServ.cargarImagenesFirebase(this.archivos);
  }

  limpiarImagenes(){
    this.archivos = [];
  }

  pruebaSobrElemento(evento){
    console.log(evento);
  }
}
