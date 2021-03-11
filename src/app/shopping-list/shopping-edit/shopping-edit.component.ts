import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f') shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startingEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    
    if (this.editMode) {
      if(this.shoppingListService.isIngredientExist(newIngredient.name)){
        alert("This name already exist.");
      }
      else{
        this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
      }
    } else {
      if(this.shoppingListService.isIngredientExist(newIngredient.name)){
        
        this.editedItemIndex = this.shoppingListService.getIngredientIndexByName(newIngredient.name)
        if(this.editedItemIndex >= 0){
          confirm("this one already exist. The amount will be updated");
          this.editedItem = this.shoppingListService.getIngredient(this.editedItemIndex);
          this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
        }
        else{
          alert("ERROR: Could not find index of an existing ingredient");
        }
      }
      else{
        this.shoppingListService.addIngredient(newIngredient);
      }
    }

    this.editMode = false;
  }

  onClear(){
    this.shoppingListForm.reset();
    this.editMode = false;
    this.editedItem = undefined;
    this.editedItemIndex = -1;
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
}
