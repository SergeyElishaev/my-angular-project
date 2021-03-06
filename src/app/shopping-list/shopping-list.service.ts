import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    startingEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];
    
    isIngredientExist(name: string){
        let result = false;

        this.ingredients.forEach(ingredient => {
            if (ingredient.name === name){
                result = true;
            }
        });

        return result;
    }

    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    getIngredientIndexByName(name: string){
        for(let i = 0; i < this.ingredients.length; i++){
            if(this.ingredients[i].name === name){
                return i;
            }
        }

        return -1;
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }
    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}