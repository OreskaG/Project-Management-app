import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NotFoundPageComponent,
    WelcomePageComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild(routes),
  ],
  exports: [HeaderComponent, FooterComponent],
})
export class CoreModule { }
