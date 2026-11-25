package com.dscribe.patient_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dscribe.patient_management.model.Patient;
import com.dscribe.patient_management.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    // Constructor Injection
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Add patient
    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // View all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // Find patient by ID
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    // Update patient
    public Patient updatePatient(Long id, Patient updatedPatient) {

        Patient existingPatient = getPatientById(id);

        existingPatient.setName(updatedPatient.getName());
        existingPatient.setAge(updatedPatient.getAge());
        existingPatient.setGender(updatedPatient.getGender());
        existingPatient.setWard(updatedPatient.getWard());
        existingPatient.setDepartment(updatedPatient.getDepartment());
        existingPatient.setDoctor(updatedPatient.getDoctor());
        existingPatient.setAdmissionDate(updatedPatient.getAdmissionDate());
        existingPatient.setStatus(updatedPatient.getStatus());

        return patientRepository.save(existingPatient);
    }

    // Delete patient
    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patientRepository.delete(patient);
    }

}