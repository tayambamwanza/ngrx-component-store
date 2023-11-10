import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ItemStore } from './items/item.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  private store = inject(ItemStore);

  // STEP 6: init observable and use in the template
  items = this.store.getAllItems;

  ngOnInit() {
    this.store.fetchAllItems();
  }

  addItem() {
    this.store.createItem(this.store.generateFalsoItem$());
  }

  updateItem() {
    this.store.updateItem(this.store.generateFalsoItem$());
  }

  deleteItem() {
    this.store.deleteItem(this.store.generateFalsoItem$());
  }
}
