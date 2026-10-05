import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password : ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    bloodType: ['', [Validators.required]],
    eyeColor: ['', [Validators.required]],
    vacationDays: [14, [Validators.required, Validators.min(0)]]
  })

  isLoading = signal(false);
  errorMessage = signal<string | null>(null)
  successMessage = signal<string | null>(null)
  

  async onSubmit(){
    if(this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const {
      email, 
      password,
      firstName,
      lastName,
      birthDate,
      bloodType,
      eyeColor,
      vacationDays
    } = this.registerForm.value;

    try{
      const {data, error} = await this.authService.signUp(email!, password!, {
        firstName: firstName!,
        lastName: lastName!,
        birthDate: birthDate!,
        bloodType: bloodType!,
        eyeColor: eyeColor!,
        vacationDays: Number(vacationDays)
      });
      if(error) throw error;

      if(data.user?.identities?.length === 0){
        this.errorMessage.set('Este email ya está registrado.');
      } else {
        this.successMessage.set('¡Registro exitoso! Por favor verifica tu email o inicia sesión.');
        this.registerForm.reset();
      }

      this.router.navigate(['/home']);
    } catch(error: any){
      this.errorMessage.set(error.message || 'Error al iniciar sesión')
    } finally{
      this.isLoading.set(false)
    }
  }
}
