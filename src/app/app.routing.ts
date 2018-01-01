import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListingsComponent } from './components/listings/listings.component';
import { ListingComponent } from './components/listing/listing.component';
import { AddListingComponent } from './components/add-listing/add-listing.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'listings', component: ListingsComponent },
    { path: 'listing/:id', component: ListingComponent },
    { path: 'add-listing', component: AddListingComponent },
    { path: '**', component: NotFoundComponent }
];

export const AppRouting = RouterModule.forRoot(appRoutes);
