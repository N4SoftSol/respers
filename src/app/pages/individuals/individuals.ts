import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IndividualService } from '../../services/individual';
import { AuthService } from '../../services/auth';
import { Individual } from '../../models/individual.model';

@Component({
  selector: 'app-individuals',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './individuals.html',
})
export class Individuals {
  public individualService = inject(IndividualService);
  public authService = inject(AuthService);

  // Modal Signals
  isModalOpen = signal(false);
  isScopeModalOpen = signal(false);
  isDeleteModalOpen = signal(false); // Delete Modal State
  isEditing = signal(false);

  // Active Selection Signals
  selectedId = signal<number | null>(null);
  selectedItemName = signal<string>(''); // Used for personalized modal text

  // Form Fields mapped to PERSON table schema
  firstName = signal('');
  lastName = signal('');
  login = signal('');
  birthDate = signal('');

  openScopeModal() {
    this.individualService.checkScopes();
    this.isScopeModalOpen.set(true);
  }

  closeScopeModal() {
    this.isScopeModalOpen.set(false);
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.selectedId.set(null);
    this.firstName.set('');
    this.lastName.set('');
    this.login.set('');
    this.birthDate.set('2000-01-01');
    this.isModalOpen.set(true);
  }

  openEditModal(item: Individual) {
    if (item.id === undefined || item.id === null) return;

    this.isEditing.set(true);
    this.selectedId.set(item.id);
    this.firstName.set(item.firstName || '');
    this.lastName.set(item.lastName || '');
    this.login.set(item.login || '');
    this.birthDate.set(item.birthDate ? item.birthDate.substring(0, 10) : '');
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  // Open Custom Delete Confirmation Modal
  confirmDelete(item: Individual) {
    if (!item.id) return;
    this.selectedId.set(item.id);
    this.selectedItemName.set(`${item.firstName} ${item.lastName}`);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.selectedId.set(null);
  }

  // Execute Deletion
  executeDelete() {
    const id = this.selectedId();
    if (id) {
      this.individualService.delete(id).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.individualService.reload();
        },
        error: (err) => console.error('Delete failed:', err),
      });
    }
  }

  saveIndividual() {
    const recordId = this.selectedId();

    const payload: Individual = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      login: this.login(),
      birthDate: this.birthDate(),
    };

    if (this.isEditing() && recordId) {
      this.individualService.update(recordId, payload).subscribe({
        next: () => {
          this.closeModal();
          this.individualService.reload();
        },
        error: (err) => console.error('Update failed:', err),
      });
    } else {
      this.individualService.create(payload).subscribe({
        next: () => {
          this.closeModal();
          this.individualService.reload();
        },
        error: (err) => console.error('Create failed:', err),
      });
    }
  }
}
