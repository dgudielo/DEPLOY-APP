import { Component,OnInit,Input, OnChanges,SimpleChanges,Output,EventEmitter} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray,FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormArray, FormControl, MaxLengthValidator } from '@angular/forms'; // Importa solo lo necesario para trabajar con formularios
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';



@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [MaterialModule,
    TablerIconsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MaterialModule],
  templateUrl: './unidades.component.html',
})

export class UnidadesComponent implements OnInit {

  @Output() FormUpdatedUnidades: EventEmitter<any> = new EventEmitter<any>();

  @Input() Cat_Unidad: any[] = [];
  @Input() Pilotos: any[] = [];
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
      this.FormUpdatedUnidades.emit(value);
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
      Cod_Unidad_Asiste: ['-1'],
      Cod_Unidad: ['', Validators.required],
      Carnet_Piloto: ['', Validators.required]   
     });

  
 
   }


   private updateHasRows(): void {
     this.hasRows = this.rows.length > 0;
   }

  

}
