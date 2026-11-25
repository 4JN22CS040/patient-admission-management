import { useEffect, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api/patients"; 

const wards = [
  "A101",
  "General Ward",
  "ICU",
  "Private Ward",
  "Emergency",
];

const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General Medicine",
];

const doctors = [
  "Dr. Kumar",
  "Dr. Sharma",
  "Dr. Mehta",
  "Dr. Rao",
];

const genders = ["Male", "Female", "Other"];

const emptyForm = {
  name: "",
  age: "",
  gender: "",
  ward: "",
  department: "",
  doctor: "",
  admissionDate: "",
  status: "ADMITTED",
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPatients() {
    try {
      setLoading(true);

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to load patient records.");
      }

      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
      setError(
        "Cannot connect to the backend. Please make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEditForm(patient) {
    setEditingId(patient.id);

    setForm({
      name: patient.name || "",
      age: patient.age ?? "",
      gender: patient.gender || "",
      ward: patient.ward || "",
      department: patient.department || "",
      doctor: patient.doctor || "",
      admissionDate: patient.admissionDate || "",
      status: patient.status || "ADMITTED",
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function savePatient(event) {
    event.preventDefault();
    setError("");

    if (!/^[A-Za-z ]+$/.test(form.name.trim())) {
      setError("Name must contain letters only.");
      return;
    }

    if (
      form.age === "" ||
      Number(form.age) < 0 ||
      Number(form.age) > 120
    ) {
      setError("Age must be between 0 and 120.");
      return;
    }

    if (
      !form.gender ||
      !form.ward ||
      !form.department ||
      !form.doctor
    ) {
      setError("Please select all the required options.");
      return;
    }

    if (!form.admissionDate) {
      setError("Please select an admission date.");
      return;
    }

    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (form.admissionDate > todayString) {
      setError("Admission date cannot be in the future.");
      return;
    }

    const patientData = {
      ...form,
      name: form.name.trim(),
      age: Number(form.age),
    };

    try {
      const url = editingId
        ? `${API}/${editingId}`
        : API;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to save patient.");
      }

      closeForm();
      await loadPatients();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  async function deletePatient(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete patient.");
      }

      await loadPatients();
    } catch (err) {
      alert(err.message);
    }
  }

  async function dischargePatient(id) {
    const confirmed = window.confirm(
      "Are you sure you want to mark this patient as discharged?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API}/${id}/discharge`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Unable to discharge patient.");
      }

      await loadPatients();
    } catch (err) {
      alert(err.message);
    }
  }

  const filteredPatients = patients.filter((patient) => {
    return (
      patient.name.toLowerCase().includes(search.toLowerCase()) &&
      (!wardFilter || patient.ward === wardFilter) &&
      (!departmentFilter ||
        patient.department === departmentFilter) &&
      (!doctorFilter || patient.doctor === doctorFilter)
    );
  });

  const totalPatients = patients.length;

  const activePatients = patients.filter(
    (patient) => patient.status === "ADMITTED"
  ).length;

  const dischargedPatients = patients.filter(
    (patient) => patient.status === "DISCHARGED"
  ).length;

  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <h2>DScribe</h2>
            <span>HEALTHCARE</span>
          </div>
        </div>

        <p className="sidebar-heading">MAIN MENU</p>
      {/*  NAVIGATION BUTTONS */}
       <button
  className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
  onClick={() => setActivePage("dashboard")}
>
  <span>▦</span>
  Dashboard
</button>

<button
  className={`nav-item ${activePage === "patients" ? "active" : ""}`}
  onClick={() => setActivePage("patients")}
>
  <span>♙</span>
  Patients
</button>

<button
  className={`nav-item ${activePage === "admissions" ? "active" : ""}`}
  onClick={() => setActivePage("admissions")}
>
  <span>▤</span>
  Admissions
</button>

        <div className="sidebar-bottom">
          <div className="sidebar-message">
            <span>✦</span>
            <h3>Care made simpler.</h3>
            <p>
              Manage admissions with confidence.
              <br />
              DScribe Healthcare.
            </p>
            <small>V1.0</small>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <header className="topbar">
          <div>
            <span className="breadcrumb">
              Dashboard / Patient Management
            </span>
          </div>

          <div className="profile">
            <div className="profile-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Admin</small>
            </div>
          </div>
        </header>

        {/* WELCOME BANNER */}
        {activePage === "dashboard" && (
          <>
        <section className="welcome-banner">
          <div>
            <span className="welcome-tag">
              DSCRIBE HEALTHCARE
            </span>

            <h1>Welcome to Patient Management</h1>

            <p>
              Manage patient admissions and records
              efficiently in one place.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={openAddForm}
          >
            + Add New Patient
          </button>
        </section>
        

        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">♙</div>
            <div>
              <p>Total Patients</p>
              <h2>{totalPatients}</h2>
              <small>All registered patients</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✚</div>
            <div>
              <p>Active Admissions</p>
              <h2>{activePatients}</h2>
              <small>Currently admitted</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div>
              <p>Discharged</p>
              <h2>{dischargedPatients}</h2>
              <small>Successfully discharged</small>
            </div>
          </div>

        </section>
        </>
        )}

        {/* PATIENT TABLE */}
        {activePage === "patients" && (
          <>
        <section className="records-card">

          <div className="records-header">
            <div>
              <h2>Patient Records</h2>
              <p>View and manage all patient admissions.</p>
            </div>

            <span className="record-count">
              {filteredPatients.length} Records
            </span>
          </div>

          {/* SEARCH AND FILTERS */}
          <div className="filters">

            <input
              type="text"
              placeholder="⌕  Search by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
            >
              <option value="">All Wards</option>
              {wards.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(e.target.value)
              }
            >
              <option value="">All Departments</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            >
              <option value="">All Doctors</option>
              {doctors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>PATIENT</th>
                  <th>AGE</th>
                  <th>GENDER</th>
                  <th>WARD</th>
                  <th>DEPARTMENT</th>
                  <th>DOCTOR</th>
                  <th>ADMISSION DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="empty-state">
                      Loading patient records...
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="empty-state">
                      No patient records found.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id}>

                      <td>{patient.id}</td>

                      <td>
                        <strong className="patient-name">
                          {patient.name}
                        </strong>
                      </td>

                      <td>{patient.age}</td>

                      <td>{patient.gender}</td>

                      <td>{patient.ward}</td>

                      <td>{patient.department}</td>

                      <td>{patient.doctor}</td>

                      <td>{patient.admissionDate}</td>

                      <td>
                        <span
                          className={`status ${
                            patient.status.toLowerCase()
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>

                      <td>
                        <div className="actions">

                          <button
                            className="edit-button"
                            onClick={() => openEditForm(patient)}
                          >
                            Edit
                          </button>

                          {patient.status === "ADMITTED" && (
                            <button
                              className="discharge-button"
                              onClick={() =>
                                dischargePatient(patient.id)
                              }
                            >
                              Discharge
                            </button>
                          )}

                          <button
                            className="delete-button"
                            onClick={() =>
                              deletePatient(patient.id)
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

        </section>
        </>
        )}
        {/*Admission Page*/}
        {activePage === "admissions" && (
  <section className="records-card">
    <div className="records-header">
      <div>
        <h2>Admission Records</h2>
        <p>Track admitted and discharged patients.</p>
      </div>
      <span className="record-count">
        {patients.length} Admissions
      </span>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <div>
          <p>Total Admissions</p>
          <h2>{totalPatients}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div>
          <p>Currently Admitted</p>
          <h2>{activePatients}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div>
          <p>Discharged</p>
          <h2>{dischargedPatients}</h2>
        </div>
      </div>
    </div>

    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>PATIENT</th>
            <th>WARD</th>
            <th>DEPARTMENT</th>
            <th>DOCTOR</th>
            <th>ADMISSION DATE</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.ward}</td>
              <td>{patient.department}</td>
              <td>{patient.doctor}</td>
              <td>{patient.admissionDate}</td>
              <td>
                <span className={`status ${patient.status.toLowerCase()}`}>
                  {patient.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)}

        <footer className="footer">
          © 2026 DScribe Healthcare. All rights reserved.
        </footer>

      </main>

      {/* ADD / EDIT PATIENT MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Patient"
                    : "Add New Patient"}
                </h2>

                <p>Enter the patient information below.</p>
              </div>

              <button
                className="close-button"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={savePatient}>

              <div className="form-grid">

                <label>
                  Patient Name *
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter patient name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Age *
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter age"
                    min="0"
                    max="120"
                    value={form.age}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Gender *
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    {genders.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Ward *
                  <select
                    name="ward"
                    value={form.ward}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Ward</option>
                    {wards.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Department *
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Doctor *
                  <select
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Admission Date *
                  <input
                    type="date"
                    name="admissionDate"
                    value={form.admissionDate}
                    onChange={handleChange}
                    max={new Date().toLocaleDateString("en-CA")}
                    required
                  />
                </label>

              </div>

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingId
                    ? "Update Patient"
                    : "Save Patient"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;