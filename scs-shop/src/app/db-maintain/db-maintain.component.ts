import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbService } from '../db.service';

@Component({
  selector: 'app-db-maintain',
  templateUrl: './db-maintain.component.html',
  styleUrls: ['./db-maintain.component.css']
})
export class DbMaintainComponent {
  mode: string;
  prevMode: string;
  tables: any;
  currentTable = "";
  currentTableCols = [];
  results: any;
  selectedCols = [];
  dbMsg = "";

  constructor (
    private route: ActivatedRoute,
    private db: DbService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((result) => {
      this.mode = result["mode"];
      this.clearData();
      this.db.getTables().subscribe(result => {
        this.tables = result['tables'];
        console.log(this.tables)
      })
    });
  }

  //create
  insert() {
    const inputFields = Array.from(document.querySelectorAll(".col-input"));

    var cols = {};
    for (let field of inputFields) {
      cols[field["id"]] = field["value"];
    }

    var payload = {
      "table": this.currentTable,
      "cols": cols
    }

    this.db.create(payload).subscribe(result => {
      if (result["status"] == "OK") {
        this.dbMsg = "1 row inserted successfully"
      } else {
        this.dbMsg = "Error: " + result["err"]["sqlMessage"];
      }
    })
  }

  //read
  select() {
    this.selectedCols = Array.from(document.querySelectorAll(".col-checkbox:checked")).map(col => {
      return col.id
    })
    //console.log("after", this.selectedCols)
    const where = (<HTMLInputElement>document.getElementById('where')).value;
    //console.log(selectedCols, where)

    let query = "";
    if (where) {
      query = `select ${this.selectedCols.join()} from ${this.currentTable} where ${where}`;
    } else {
      query = `select ${this.selectedCols.join()} from ${this.currentTable}`;
    }
    
    this.db.read(query).subscribe(result => {
      //console.log(result);
      this.prevMode = this.mode;
      this.mode = 'result';
      this.results = result["info"];
    });
  }

  update() {
    const inputFields = Array.from(document.querySelectorAll(".col-input"));
    const where = (<HTMLInputElement>document.getElementById('where')).value;

    var cols = {};
    for (let field of inputFields) {
      cols[field["id"]] = field["value"];
    }

    var payload = {
      "table": this.currentTable,
      "cols": cols,
      "where": where
    }

    this.db.update(payload).subscribe(result => {
      if (result["status"] == "OK") {
        this.dbMsg = "Success - " + result["info"]["message"];
      } else {
        this.dbMsg = "Error: " + result["err"]["sqlMessage"];
      }
    })
  }

  delete() {
    const where = (<HTMLInputElement>document.getElementById('where')).value;
    
    let query = "";
    if (where) {
      query = `delete from ${this.currentTable} where ${where}`;
    } else {
      query = `delete from ${this.currentTable}`;
    }

    this.db.delete(query).subscribe(result => {
      if (result["status"] == "OK") {
        this.dbMsg = `Success - ${result["info"]["affectedRows"]} affected rows`;
      } else {
        this.dbMsg = "Error: " + result["err"]["sqlMessage"];
      }
    })
  }

  clearData() {
    this.currentTable = "";
    this.currentTableCols = [];
    this.selectedCols = [];
    this.prevMode = "";
    this.dbMsg = "";
  }

  back() {
    if (this.mode == 'result' && this.prevMode) {
      this.mode = this.prevMode;
      this.clearData();
    }
  }

  toggleCol(col) {
    if (this.selectedCols.includes(col)) {
      this.selectedCols = this.selectedCols.filter(item => item !== col);
      //console.log(this.selectedCols);
    } else {
      this.selectedCols.push(col);
      //console.log(this.selectedCols)
    }
  }

  setTable(table) {
    this.clearData();
    this.currentTable = table;
    this.cols(table);
  }

  cols(table) {
    this.db.getColumnsFromTable(table).subscribe(
      result => {
        this.currentTableCols = result['columns'];
        this.selectedCols = result['columns'];
      }
    )
  }
}
