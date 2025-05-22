import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

import { UserInterfaceComponent } from './components/user-interface/user-interface.component';
import { SocialLinksComponent } from './components/social-links/social-links.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,        
    HttpClientModule,
    UserInterfaceComponent,SocialLinksComponent   
  ],
  exports: [
    UserInterfaceComponent,
    SocialLinksComponent
  ]
})
export class SharedUiModule { }