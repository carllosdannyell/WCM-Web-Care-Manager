import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService, Patient } from './patient.service';
import { io, Socket } from 'socket.io-client';
import { map } from 'rxjs';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  isFormLocked: boolean = false;
  lockedBy = '';
  currentUser: string = '';
  counter: number = -2;
  currentEditingField = '';
  editorMessage = '';
  showViewModal: boolean = false;
  showEditModal: boolean = false;
  showCreateModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedPatient: Patient | null = null;
  formPatient = {
    name: '',
    social_name: '',
    email: '',
    phone: '',
  };
  newPatient = {
    name: '',
    social_name: '',
    email: '',
    phone: '',
  };

  socket!: Socket;
  fieldLocks: { [key: string]: { [context: string]: string } } = {
    name: {},
    email: {},
    phone: {},
    address: {},
  };

  constructor(
    private patientService: PatientService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/']);
        return;
      }
      this.currentUser = this.getCurrentUserFromToken(token);
    }

    this.loadPatients();

    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    this.socket.on(
      'editing-count',
      (payload: { patientId: string; count: number; users: string[] }) => {
        const pid = Number(payload.patientId);

        if (this.showEditModal && this.selectedPatient?.id === pid) {
          this.counter = payload.count;
        }

        this.isFormLocked = false;
        this.lockedBy = '';
      }
    );

    this.socket.on('send-message', ({ field, user, context }) => {
      if (user !== this.currentUser) {
        this.fieldLocks[field][context] = user;
      }
    });

    this.socket.on('field-locked', ({ field, user, context }) => {
      this.isFormLocked = true;
      this.lockedBy = user;
    });

    this.socket.on('patient-deleted', (data) => {
      this.patients = this.patients.filter((p) => p.id !== data.id);
    });

    this.socket.on('field-unlocked', ({ field, context }) => {
      delete this.fieldLocks[field][context];
    });

    this.socket.on('field-updated', ({ field, value, user, context }) => {
      if (user !== this.currentUser) {
        if (context === 'edit' && this.showEditModal) {
          (this.formPatient as any)[field] = value;
        } else if (context === 'create' && this.showCreateModal) {
          (this.newPatient as any)[field] = value;
        }
      }
    });

    this.socket.on('patient-updated', (updatedPatient: Patient) => {
      const index = this.patients.findIndex((p) => p.id === updatedPatient.id);
      if (index !== -1) {
        this.patients[index] = { ...updatedPatient };
      }
      this.isFormLocked = false;
      this.lockedBy = '';
    });

    this.socket.on('patient-created', (newPatient: Patient) => {
      this.patients.push({ ...newPatient });
    });
  }

  ngOnDestroy(): void {
    if (this.showEditModal && this.selectedPatient) {
      this.socket.emit('stop-editing', {
        patientId: this.selectedPatient.id,
        user: this.currentUser,
      });
    }
    this.unlockAllFields();
    this.socket.disconnect();
  }

  private loadPatients(): void {
    this.patientService.getAll().subscribe((patients) => {
      this.patients = patients;
    });
  }

  openViewModal(patient: Patient): void {
    this.selectedPatient = patient;
    this.showViewModal = true;
    console.log('this.patients', this.patients);
  }

  openEditModal(patient: Patient): void {
    this.selectedPatient = patient;
    this.formPatient = {
      name: patient.name,
      social_name: patient.name,
      email: patient.email,
      phone: patient.phone,
    };
    this.showEditModal = true;
    this.socket.emit('start-editing', {
      patientId: patient.id,
      user: this.currentUser,
    });
  }

  openCreateForm(): void {
    this.selectedPatient = null;
    this.newPatient = {
      name: '',
      social_name: '',
      email: '',
      phone: '',
    };
    this.showCreateModal = true;
  }

  openDeleteModal(patient: Patient): void {
    this.selectedPatient = patient;
    this.showDeleteModal = true;
  }

  closeModals(): void {
    if (this.showEditModal && this.selectedPatient) {
      this.socket.emit('stop-editing', {
        patientId: this.selectedPatient.id,
        user: this.currentUser,
      });
      this.counter -= 1;
    }
    this.showViewModal =
      this.showEditModal =
      this.showCreateModal =
      this.showDeleteModal =
        false;
    this.selectedPatient = null;
    this.unlockAllFields();
  }

  createPatient(): void {
    if (
      !this.newPatient.name ||
      !this.newPatient.email ||
      !this.newPatient.phone
    ) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    this.patientService.create(this.newPatient).subscribe((newPatient) => {
      this.loadPatients();
      this.closeModals();
      this.socket.emit('patient-created', newPatient);
    });
  }

  savePatient(): void {
    if (
      !this.formPatient.name ||
      !this.formPatient.email ||
      !this.formPatient.phone
    ) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (this.selectedPatient) {
      this.patientService
        .update(this.selectedPatient.id, this.formPatient)
        .subscribe((updatedPatient) => {
          this.loadPatients();
          this.closeModals();
          this.socket.emit('patient-updated', updatedPatient);
        });
    }
  }

  confirmDelete(): void {
    if (this.selectedPatient) {
      this.patientService.delete(this.selectedPatient.id).subscribe(() => {
        const deletedId = this.selectedPatient!.id;
        this.patients = this.patients.filter((p) => p.id !== deletedId);
        this.socket.emit('patient-deleted', { id: deletedId });
        this.closeModals();
      });
    }
  }

  onFocus(field: string, context: 'create' | 'edit'): void {
    this.socket.emit('lock-field', { field, user: this.currentUser, context });
  }

  onBlur(field: string, context: 'create' | 'edit'): void {
    this.socket.emit('unlock-field', {
      field,
      user: this.currentUser,
      context,
    });
  }

  onInput(field: string, value: string, context: 'create' | 'edit'): void {
    console.log(this.formPatient);
    console.log(this.selectedPatient);

    this.socket.emit('update-field', {
      field,
      value,
      user: this.currentUser,
      context,
    });
  }

  isFieldLocked(field: string, context: 'create' | 'edit'): boolean {
    return !!this.fieldLocks[field][context];
  }

  getLocker(field: string, context: 'create' | 'edit'): string {
    return this.fieldLocks[field][context] || '';
  }

  private unlockAllFields(): void {
    ['name', 'email', 'phone', 'address'].forEach((field) => {
      ['create', 'edit'].forEach((context) => {
        this.socket.emit('unlock-field', { field, context });
      });
    });
    this.fieldLocks = { name: {}, email: {}, phone: {}, address: {} };
  }

  private getCurrentUserFromToken(token: string): string {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return (
        decodedPayload.name || `Usuário-${Math.floor(Math.random() * 1000)}`
      );
    } catch (e) {
      console.error('Erro ao decodificar o token JWT:', e);
      return `Usuário-${Math.floor(Math.random() * 1000)}`;
    }
  }
}
