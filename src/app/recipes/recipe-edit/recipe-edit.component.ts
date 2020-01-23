import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipesComponent } from '../recipes.component';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  editForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private recipeService: RecipeService) { }

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

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
    }
    else {
      this.recipeService.addRecipe(newRecipe);
    }

    console.log(this.editForm);
    console.log(newRecipe);

    this.onCancelEdit();
  }

  getControls() {
    return (<FormArray>this.editForm.get('ingredients')).controls;
  }

  onCancelEdit() {
    this.router.navigate(['recipes', this.id]);
  }

  onAddIngredient() {
    let ingredientFormGroup = new FormGroup({
      'name': new FormControl(),
      'amount': new FormControl()
    });

    (<FormArray>this.editForm.get('ingredients')).push(ingredientFormGroup);
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.editForm.get('ingredients')).removeAt(index);
  }
}
