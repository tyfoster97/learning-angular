import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './hero-list/heroes.component';

const heroRoutes: Routes = [
  { path: 'heroes', component: HeroesComponent },
  { path: 'hero/:id', component: HeroDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(heroRoutes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
