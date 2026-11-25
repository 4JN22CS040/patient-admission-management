package com.dscribe.patient_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dscribe.patient_management.model.Patient;
import com.dscribe.patient_management.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // Add patient
    @PostMapping
    public ResponseEntity<Patient> addPatient(
            @Valid @RequestBody Patient patient) {
    	patient.setStatus("ADMITTED");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.addPatient(patient));
    }

    // View all patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

   
 // View patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        try {
            Patient patient = patientService.getPatientById(id);
            return ResponseEntity.ok(patient);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update patient
    @PutMapping("/{id}")
    public Patient updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody Patient patient) {

        return patientService.updatePatient(id, patient);
    }

    // Delete patient
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {

        patientService.deletePatient(id);

        return ResponseEntity.ok("Patient deleted successfully");
    }

    // Discharge patient
    @PatchMapping("/{id}/discharge")
    public Patient dischargePatient(@PathVariable Long id) {

        Patient patient = patientService.getPatientById(id);

        patient.setStatus("DISCHARGED");

        return patientService.updatePatient(id, patient);
    }
}