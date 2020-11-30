import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const components: any[] = [
  LayoutComponent
];

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
  ],
  exports: [
    LayoutComponent,
  ]
})
export class SharedModule {
}
