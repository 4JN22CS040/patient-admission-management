package com.dscribe.patient_management.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[A-Za-z ]+$",
             message = "Name must contain letters only")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 120, message = "Age cannot exceed 120")
    private Integer age;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "Male|Female|Other", message = "Invalid gender")
    private String gender;

    @NotBlank(message = "Ward is required")
    @Pattern(
    	    regexp = "A101|General Ward|ICU|Private Ward|Emergency",
    	    message = "Invalid ward selected"
    	)
    private String ward;

    @NotBlank(message = "Department is required")
    @Pattern(
    	    regexp = "Cardiology|Neurology|Orthopedics|Pediatrics|Dermatology|General Medicine",
    	    message = "Invalid department selected"
    	)
    private String department;

    @NotBlank(message = "Doctor is required")
    @Pattern(
    	    regexp = "Dr\\. Kumar|Dr\\. Sharma|Dr\\. Mehta|Dr\\. Rao",
    	    message = "Invalid doctor selected"
    	)
    private String doctor;

    @NotNull(message = "Admission date is required")
    @PastOrPresent(message = "Admission date cannot be in the future")
    private LocalDate admissionDate;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "ADMITTED|DISCHARGED",
             message = "Invalid patient status")
    private String status = "ADMITTED";


    // Default constructor
    public Patient() {

    }


    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDoctor() {
        return doctor;
    }

    public void setDoctor(String doctor) {
        this.doctor = doctor;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
}