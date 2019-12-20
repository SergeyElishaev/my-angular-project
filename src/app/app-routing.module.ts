import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'home', component: MainComponent},
    {path: 'recipes', component: RecipesComponent, children: [
      {path: '', component: RecipeStartComponent},
      {path: 'new', component: RecipeEditComponent},
      {path: ':id', component: RecipeDetailComponent},
      {path: ':id/edit', component: RecipeEditComponent},
      {path: '**', redirectTo: ''}
    ]},
    {path: 'shopping-list', component: ShoppingListComponent},
    {path: 'error-page', component: ErrorPageComponent, data: {message: 'Page not found!'}},
    {path: 'sign-up', component: SignUpComponent},
    {path: '**', redirectTo: '/error-page'}
  ];
  
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
