import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common'; // Added NgClass import
import { IndividualService } from '../../../services/individual';
import { StoredProcConfig, StoredProcResponse } from '../../../models/stored-proc.model';

@Component({
  selector: 'app-data-management',
  standalone: true,
  imports: [NgClass],
  templateUrl: './data-management.html',
})
export class DataManagement {
  public individualService = inject(IndividualService);

  // Active Execution & Confirmation Signals
  selectedProc = signal<StoredProcConfig | null>(null);
  isConfirmModalOpen = signal(false);
  isExecuting = signal(false);

  // Feedback Status Signals
  lastResponse = signal<StoredProcResponse | null>(null);
  lastError = signal<string | null>(null);

  // Registry of Stored Procedures
  procedures: StoredProcConfig[] = [
    {
      id: 'reset_person_data',
      title: 'Reset Person Domain Data',
      description:
        'Executes RESET_PERSON_DATA procedure to purge and re-seed all individual table records to initial defaults.',
      endpoint: '/data-app/reset_person_data',
      badgeColor: 'bg-red-500',
      requiresAdmin: true,
    },
    {
      id: 'compile_schema',
      title: 'Compile Oracle Schema',
      description:
        'Executes schema recompilation across all Oracle database objects, packages, and invalid procedures.',
      endpoint: '/api/admin/oracle/compile-schema',
      badgeColor: 'bg-amber-500',
      requiresAdmin: true,
    },
  ];

  confirmExecution(proc: StoredProcConfig) {
    this.selectedProc.set(proc);
    this.lastResponse.set(null);
    this.lastError.set(null);
    this.isConfirmModalOpen.set(true);
  }

  closeConfirmModal() {
    this.isConfirmModalOpen.set(false);
    this.selectedProc.set(null);
  }

  runProcedure() {
    const proc = this.selectedProc();
    if (!proc) return;

    this.isExecuting.set(true);
    this.lastResponse.set(null);
    this.lastError.set(null);

    this.individualService.executeStoredProcedure(proc.endpoint).subscribe({
      next: (res) => {
        this.isExecuting.set(false);
        this.lastResponse.set(res);
        this.closeConfirmModal();
        this.individualService.reload();
      },
      error: (err) => {
        this.isExecuting.set(false);
        this.lastError.set(err?.error?.message || 'Failed to execute stored procedure.');
        this.closeConfirmModal();
      },
    });
  }
}
