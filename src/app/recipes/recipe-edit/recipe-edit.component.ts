import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  editForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
      }
    );

    this.initForm();
  }

  private initForm() {
    let defaultRecipeName: string = '';
    let defaultRecipeImagePath: string = '';
    let defaultRecipeDescription: string = '';
    let defaultRecipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      defaultRecipeName = recipe.name;
      defaultRecipeImagePath = recipe.imagePath;
      defaultRecipeDescription = recipe.description;

      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          defaultRecipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }
    this.editForm = new FormGroup({
      'name': new FormControl(defaultRecipeName, Validators.required),
      'description': new FormControl(defaultRecipeDescription),
      'imgPath': new FormControl(defaultRecipeImagePath),
      'ingredients': defaultRecipeIngredients
    });
  }

  onSubmit() {
    let newRecipe: Recipe = new Recipe(
      this.editForm.get('name').value,
      this.editForm.get('description').value,
      this.editForm.get('imgPath').value,
      (<FormArray>this.editForm.get('ingredients')).value
    );
    this.recipeService.addRecipe(newRecipe);
    
    console.log(this.editForm);
    console.log(newRecipe);

    this.editForm.reset();
  }

  getControls() {
    return (<FormArray>this.editForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    const ingredientControl = new FormControl(null);

    (<FormArray>this.editForm.get('ingredients')).push(ingredientControl);
  }
}
