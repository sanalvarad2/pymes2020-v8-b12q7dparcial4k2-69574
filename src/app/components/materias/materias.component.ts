import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";
import {Materia} from "../../models/materia"
import {MateriasService} from "../../services/materias.service"

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit {

  Titulo = "Articulos"; 
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; // inicialmente inicia en el listado de articulos (buscar con parametros)

  Materias = []

  FormReg: FormGroup;

  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private materiasService: MateriasService,
    private modalDialogService: ModalDialogService
  ) { }

  ngOnInit() {
    this.FormReg = this.formBuilder.group({
      IdMateria: [0],
      MateriaAnio: [
        0,
        [Validators.required, Validators.pattern("[0-9]{1,7}")]
      ],
      MateriaNombre: [
        "",
        [Validators.required,  Validators.maxLength(50)]
      ]
    })

    this.CargarMaterias()
  }

  CargarMaterias(){
      this.materiasService.get().subscribe((res:Materia[]) => {
      this.Materias = res
    })

  }

  CargarPorID(id:number){
    this.materiasService.getById(id).subscribe((res:Materia) => {
      this.FormReg.patchValue(res);
    })
  }

  Consultar(obj:Materia){
    var id = obj.IdMateria;
    this.AccionABMC = 'C';
    this.CargarPorID(id);
  }

  Modificar(obj:Materia){
    var id = obj.IdMateria;
    this.AccionABMC = 'M';
    this.CargarPorID(id);
  }

  Grabar(){
    this.submitted = true;
    // verificar que los validadores esten OK
     if (this.FormReg.invalid) {
      return;
    }

    const itemCopy = { ...this.FormReg.value };

    if (itemCopy.IdMateria == 0 || itemCopy.IdMateria == null) {
      itemCopy.IdMateria = 0;
      this.materiasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.CargarMaterias();
      });
    } else {
      // modificar put
      this.materiasService
        .put(itemCopy.IdMateria, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.CargarMaterias();
        });
    }

  }

  Volver(){
    this.AccionABMC = 'L';
    this.FormReg.reset();
  }

  Agregar(){
    this.AccionABMC = "A";
    this.FormReg.reset();
    this.submitted = false;
    //this.FormReg.markAsPristine();
    this.FormReg.markAsUntouched();
  }
}
