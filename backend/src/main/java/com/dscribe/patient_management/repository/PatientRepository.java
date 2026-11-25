package com.dscribe.patient_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dscribe.patient_management.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

} 