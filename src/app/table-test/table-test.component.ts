import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  personName: string;
  position: number;
  weight: number;
  symbol: string;
  isSelected?: boolean;
  detail: PeriodicElementDetail[]
}

export interface PeriodicElementDetail {
  personName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, personName: 'Hydrogen', weight: 1.0079, symbol: 'H', detail: [{personName: 'Hydrogen'}]},
  {position: 2, personName: 'Helium', weight: 4.0026, symbol: 'He', detail: [{personName: 'Helium'}]},
  {position: 3, personName: 'Lithium', weight: 6.941, symbol: 'Li', detail: [{personName: 'Lithium'}]},
  {position: 4, personName: 'Beryllium', weight: 9.0122, symbol: 'Be', detail: [{personName: 'Beryllium'}]},
  {position: 5, personName: 'Boron', weight: 10.811, symbol: 'B', detail: [{personName: 'Boron'}]},
  {position: 6, personName: 'Carbon', weight: 12.0107, symbol: 'C', detail: [{personName: 'Hydrogen'}]},
  {position: 7, personName: 'Nitrogen', weight: 14.0067, symbol: 'N', detail: [{personName: 'Hydrogen'}]},
  {position: 8, personName: 'Oxygen', weight: 15.9994, symbol: 'O', detail: [{personName: 'Hydrogen'}]},
  {position: 9, personName: 'Fluorine', weight: 18.9984, symbol: 'F', detail: [{personName: 'Hydrogen'}]},
  {position: 10, personName: 'Neon', weight: 20.1797, symbol: 'Ne', detail: [{personName: 'Hydrogen'}]},
];

@Component({
  selector: 'app-table-test',
  templateUrl: './table-test.component.html',
  styleUrls: ['./table-test.component.scss']
})
export class TableTestComponent implements OnInit {
  displayedColumns: string[] = ['position', 'personName', 'weight', 'symbol'];
  queryData:any[] = []
  dataSource = new MatTableDataSource();
  selectRow:any = {
    position: null,
    status: null
  };
  seletedColor = '#dee2e6';

  constructor() { }

  ngOnInit(): void {
    this.queryData = ELEMENT_DATA
    this.dataSource = new MatTableDataSource(this.queryData)
  }

  toggle(row){
    console.log(row)
    this.queryData.forEach(value => {
      value.isSelected = value.position === row.position ? true : false;
    });
    console.log(row.position)
    if(this.selectRow.position !== row.position){
      this.selectRow = {
        position: row.position,
        status: true
      }
    } else {
      this.selectRow.status = !this.selectRow.status;
      this.selectRow.position = row.position;
    }

    console.log('selectRow', this.selectRow)
  }

}
