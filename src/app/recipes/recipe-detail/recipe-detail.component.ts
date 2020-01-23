import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']
      this.recipe = this.recipeService.getRecipe(this.id);
    });
  }

  onMenuItemClick(recipe: Recipe, itemClicked: string) {
    switch (itemClicked) {
      case 'toShoppingList':
        this.onAddToShoppingList(recipe);
        break;
      case 'editRecipe':
        this.onEditRecipe();
        break;
      case 'deleteRecipe':
        this.onDeleteRecipe(this.id);
        break;
      default:
        console.warn('this action is not implemented yet');
        break;
    }
  }

  onAddToShoppingList(recipe: Recipe) {
    this.recipeService.addIngredientsToShoppingList(recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe(index: number) {
    this.recipeService.deleteRecipe(index);
    this.router.navigate(['recipes']);
  }

  onDeleteIngredient(index: number) {

  }
}
