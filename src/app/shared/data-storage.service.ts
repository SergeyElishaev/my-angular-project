import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    firebaseUrl: string = 'https://my-angular-project-server.firebaseio.com/';

    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

    storeRecipe() {
        const recipes = this.recipeService.getRecipes();

        this.http.put(this.firebaseUrl + 'recipes.json', recipes).subscribe(response => console.log(response));
    }

    fecthRecipes() {
        return this.http.get<Recipe[]>(this.firebaseUrl + 'recipes.json').pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                })
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }
}