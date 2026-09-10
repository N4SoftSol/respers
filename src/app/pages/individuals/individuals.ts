import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IndividualService } from '../../services/individual';
import { AuthService } from '../../services/auth';
import { Individual } from '../../models/individual.model';

@Component({
  selector: 'app-individuals',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './individuals.html',
})
export class Individuals {
  public individualService = inject(IndividualService);
  public authService = inject(AuthService);
  protected readonly Math = Math;

  // Search Filter Signal
  searchQuery = signal('');

  // Pagination Signals
  currentPage = signal(1);
  pageSize = signal(10); // Default to 10 entries like TailAdmin

  // Handle Page Size Dropdown Change
  onPageSizeChange(newSize: number) {
    this.pageSize.set(Number(newSize));
    this.currentPage.set(1); // Reset to Page 1 when size changes
  }

  // Computed Signal: Filtered List
  filteredIndividuals = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.individualService.individuals.value() || [];

    if (!query) return list;

    return list.filter(
      (item) =>
        item.firstName?.toLowerCase().includes(query) ||
        item.lastName?.toLowerCase().includes(query) ||
        item.login?.toLowerCase().includes(query),
    );
  });

  // Computed Signal: Total Pages
  totalPages = computed(() => {
    const totalItems = this.filteredIndividuals().length;
    return Math.max(1, Math.ceil(totalItems / this.pageSize()));
  });

  // Computed Signal: Paginated Slice of Data
  paginatedIndividuals = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return this.filteredIndividuals().slice(startIndex, startIndex + size);
  });

  // Modal Signals
  isModalOpen = signal(false);
  isScopeModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isEditing = signal(false);

  // Active Selection Signals
  selectedId = signal<number | null>(null);
  selectedItemName = signal<string>('');

  // Form Fields
  firstName = signal('');
  lastName = signal('');
  login = signal('');
  birthDate = signal('');

  // Pagination Controls
  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page on new search
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

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
