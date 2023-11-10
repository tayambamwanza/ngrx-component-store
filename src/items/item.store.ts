import { Injectable } from '@angular/core';
import { concatMap, exhaustMap, Observable, of, switchMap } from 'rxjs';
import { randFullName, randNumber, randBoolean, randUuid } from '@ngneat/falso';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Item } from './item.interface';

interface ItemState {
  items: Item[];
}

@Injectable({ providedIn: 'root' })
// STEP 1: Extend Component Store with State Class/Interface
export class ItemStore extends ComponentStore<ItemState> {
  // STEP 2: Set initial data in the constructor
  constructor() {
    super({
      items: [],
    });
  }

  // STEP 3: Use selector to get data
  getAllItems = this.selectSignal((state) => {
    console.log(state.items);
    return state.items;
  });

  // STEP 4: Fetch data from api and set items value.
  fetchAllItems = this.effect<void>((trigger$) =>
    trigger$.pipe(
      exhaustMap(() =>
        of(this.generateFalsoUsers()).pipe(
          // 👇 Act on the result within inner pipe.
          tapResponse(
            (items) => this.setItems(items),
            (error) => console.log(error)
          )
        )
      )
    )
  );

  // STEP 5 continues in the component
  readonly setItems = this.updater((state, items: Item[]) => ({
    items,
  }));

  clearItems = this.updater((state) => ({ items: [] }));

  createItem = this.effect((item$: Observable<Item>) =>
    item$.pipe(
      concatMap((item) =>
        of(item).pipe(
          // 👇 Act on the result within inner pipe.
          tapResponse(
            (item) => this.addItem(item),
            (error) => console.log(error)
          )
        )
      )
    )
  );

  readonly addItem = this.updater((state, item: Item) => {
    return { ...state, items: [item, ...state.items] };
  });

  // Not properly implemented in this demo
  updateItem = this.effect((item$: Observable<Item>) => 
    item$.pipe(switchMap((falsoItem) => of(falsoItem)
    .pipe(tapResponse(
      (item) => this.editItem(item),
      (error) => console.log(error)
    ))))
  )

    /** Update item in local array */
  editItem = this.updater((state, updatedItem: Item) => {
    // Checks for item by ID, disabled for demo.
    const updatedItemIndex = 0;
    const updatedItems = state.items;
    updatedItems[updatedItemIndex] = updatedItem;
    return {...state, items: updatedItems}
  });

    // Not properly implemented in this demo
    deleteItem = this.effect((item$: Observable<Item>) => 
    item$.pipe(switchMap((falsoItem) => of(falsoItem)
    .pipe(tapResponse(
      (item) => this.editItem(item),
      (error) => console.log(error)
    ))))
  )

    /** Delete item in local array */
    removeItem = this.updater((state, deletedItem: Item) => {
        // Checks for item by ID, disabled for demo.
        // const remainingItems = items.filter(item => item.id === deletedItem.id);
        const remainingItems = state.items;
        remainingItems.splice(0, 1);
      return {...state, items: remainingItems}
    });

  // Create Fake User
  public generateFalsoItem() {
    return {
      id: randUuid(),
      fullName: randFullName(),
      age: randNumber(),
      isNerdy: randBoolean(),
    };
  }

  public generateFalsoItem$() {
    return of({
      id: randUuid(),
      fullName: randFullName(),
      age: randNumber(),
      isNerdy: randBoolean(),
    });
  }

  // Create Fake Users Array
  generateFalsoUsers() {
    return new Array(10).fill(null).map(this.generateFalsoItem);
  }
}
