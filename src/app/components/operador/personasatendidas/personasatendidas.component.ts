import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormArray, FormControl, MaxLengthValidator } from '@angular/forms'; // Importa solo lo necesario para trabajar con formularios
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-personasatendidas',
  standalone: true,
  imports: [MaterialModule,
    TablerIconsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MaterialModule],
  templateUrl: './personasatendidas.component.html'
}
)



export class PersonasComponent implements OnInit {
  //  @Output() rowsChanged: EventEmitter<UntypedFormArray> = new EventEmitter<UntypedFormArray>();
  @Output() FormUpdatedPersonasAtendidas: EventEmitter<any> = new EventEmitter<any>();

  @Input() catTraslado: any[] = [];
  addForm!: FormGroup | any;
  rows: FormArray;
  rowsAdded: boolean = false;
  hasRows: boolean = false;
  fgFormRetorno!: FormGroup;




  constructor(private fb: FormBuilder) {
    this.addForm = this.fb.group({});
    this.rows = this.fb.array([]);
    this.addForm.addControl('rows', this.rows);
    this.rows.push(this.createItemFormGroup());
    this.updateHasRows();

    this.addForm.valueChanges.subscribe((value: any) => {
      this.FormUpdatedPersonasAtendidas.emit(value);
    });




  }







  ngOnInit(): void {
    this.createItemFormGroup()
  }

  getAddForm(): FormGroup {
    return this.createItemFormGroup();
  }

  // Método para obtener los valores del formulario
  getFormValues(): any {
    return this.createItemFormGroup().value;
  }


  onAddRow(): void {
    this.rows.push(this.createItemFormGroup());
    this.rowsAdded = true;
    // this.rowsChanged.emit(this.rows);
    this.updateHasRows();

  }

  onRemoveRow(rowIndex: number): void {
    this.rows.removeAt(rowIndex);
    // this.rowsChanged.emit(this.rows);
    this.updateHasRows();

  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      Cod_Per_Atendida: ['-1'],
      Nombre: ['', Validators.required],
      Edad: ['', Validators.required],
      Domicilio: ['', Validators.required],
      Fallecido: ['', Validators.required],
      Acompanante: ['', Validators.required],
      Cod_Ubi_Traslado: ['', Validators.required]
    });
  }
  private updateHasRows(): void {
    this.hasRows = this.rows.length > 0;
  }
}
