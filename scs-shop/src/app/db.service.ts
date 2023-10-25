import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  // create(table, layout, values) {

  // }

  create(payload) {
    return this.httpClient.post('api/admin/insert', payload);
  }

  read(query) {
    return this.httpClient.post('api/admin/query', {mode: 'read', query: query})
  }

  update(payload) {
    return this.httpClient.post('api/admin/update', payload);
  }

  delete(query) {
    return this.httpClient.post('api/admin/query', {mode: 'delete', query: query})
  }

  getTables() {
    return this.httpClient.get('api/admin/all');
  }

  getColumnsFromTable(tableName) {
    return this.httpClient.post('api/admin/cols', {table: tableName});
  }
}
