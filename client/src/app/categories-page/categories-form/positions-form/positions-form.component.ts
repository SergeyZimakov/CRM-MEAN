import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  positions: Position[] = [];
  positionId: string | undefined | null = null;
  loading = false;
  form: FormGroup;

  constructor(
    private positionsService: PositionsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe(
      positions => {
        this.positions = positions;
        this.loading = false;
      }
    )
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }
  ngOnDestroy() {
    this.modal.destroy!();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open!();
    MaterialService.updateTextInputs();
  }
  
  onAddPosition() {
    this.positionId = null;
    this.modal.open!();
    this.form.reset();
  }

  onCancel() {
    this.modal.close!();
  }
  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const desicion = window.confirm(`Remove ${position.name}?`);
    if(desicion) {
      this.positionsService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => {
          MaterialService.toast(error.error.message);
        }
      )
    }
  }

  onSubmit() {
    this.form.disable()
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    if(this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position;
          MaterialService.toast('Position was updated');
        },
        error => {
          this.form.enable()
          MaterialService.toast(error.error.message);
        },
        () => {
          this.modal.close!();
          this.form.reset()
          this.form.enable();
        }
      )
    } else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Position was created');
          this.positions.push(position);
        },
        error => {
          this.form.enable()
          MaterialService.toast(error.error.message);
        },
        () => {
          this.modal.close!();
          this.form.reset()
          this.form.enable();
        }
      )
    }
  }

}
