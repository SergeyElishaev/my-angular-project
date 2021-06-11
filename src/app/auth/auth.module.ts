import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";

@NgModule({
    declarations: [
        SignUpComponent,
        SignInComponent
    ],
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'sign-in', component: SignInComponent },
                    { path: 'sign-up', component: SignUpComponent }
                ]
            }
        ])
    ]
})
export class AuthModule { }