// ===============================
// STUDY BUTTONS
// ===============================

const studyButtons =
    document.querySelectorAll(".study-item button");

// Load saved study progress
let completedStudies =
    JSON.parse(localStorage.getItem("completedStudies")) || [];

// Restore completed buttons
studyButtons.forEach(function (button, index) {

    if (completedStudies.includes(index)) {

        button.textContent = "Completed";

        button.style.backgroundColor = "green";

        button.style.color = "white";

    }

});

// Add click event
studyButtons.forEach(function (button, index) {

    button.addEventListener("click", function () {

        button.textContent = "Completed";

        button.style.backgroundColor = "green";

        button.style.color = "white";

        // Save completed study
        if (!completedStudies.includes(index)) {

            completedStudies.push(index);

        }

        localStorage.setItem(
            "completedStudies",
            JSON.stringify(completedStudies)
        );

        // Update progress
        updateProgress();

    });

});




// ===============================
// COURSE SYSTEM
// ===============================

// Store courses
let courseData = JSON.parse(localStorage.getItem("courseData")) || [];

// Get elements from HTML
const addCourseBtn = document.getElementById("addCourseBtn");
const courseList = document.getElementById("courseList");

// Display courses
function displayStudyCourses() {

    if (!courseList) return;

    courseList.innerHTML = "";

    courseData.forEach(function (course) {

        const newCourse = document.createElement("div");

        newCourse.classList.add("course-card");

        newCourse.innerHTML = `
            <h3>${course.name}</h3>
            <p>${course.code}</p>

            <div class="course-buttons">

                <button class="edit-course complete-assignment">
                    Edit
                </button>

                <button class="delete-course complete-assignment">
                    Delete
                </button>

            </div>
        `;

        courseList.appendChild(newCourse);

    });

}

// Add a course
if (addCourseBtn) {
    addCourseBtn.addEventListener("click", function () {

        const courseName = prompt("Enter the course name:");

        const courseCode = prompt("Enter the course code:");

        if (courseName && courseCode) {

            const course = {
                name: courseName,
                code: courseCode
            };

            courseData.push(course);

            localStorage.setItem(
                "courseData",
                JSON.stringify(courseData)
            );

            displayStudyCourses();
            updateStatistics();

        }

    });
}

// Delete a study course
document.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-course")) {

        const courseCard =
            event.target.closest(".course-card");

        const items =
            Array.from(courseList.children);

        const index =
            items.indexOf(courseCard);

        courseData.splice(index, 1);

        localStorage.setItem(
            "courseData",
            JSON.stringify(courseData)
        );

        displayStudyCourses();

        updateStatistics();

    }

});

// Edit a study course
document.addEventListener("click", function (event) {

    if (event.target.classList.contains("edit-course")) {

        const courseCard =
            event.target.closest(".course-card");

        const items =
            Array.from(courseList.children);

        const index =
            items.indexOf(courseCard);

        const newName =
            prompt(
                "Enter the new course name:",
                courseData[index].name
            );

        const newCode =
            prompt(
                "Enter the new course code:",
                courseData[index].code
            );

        if (newName && newCode) {

            courseData[index].name = newName;

            courseData[index].code = newCode;

            localStorage.setItem(
                "courseData",
                JSON.stringify(courseData)
            );

            displayStudyCourses();

        }

    }

});

// Display saved courses when the page loads
displayStudyCourses();




// ===============================
// EXAM DATE COUNTDOWN
// ===============================

let examDate = Number(localStorage.getItem("studyHubExamDate")) || new Date("October 21, 2026 09:00:00").getTime();

const examDateText = document.getElementById("examDateText");

const examStatus = document.getElementById("examStatus");

function updateCountdown() {

    if (!document.getElementById("exam-section")) return;

    const now = new Date().getTime();

    const difference = examDate - now;

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (difference % (1000 * 60)) /
        1000
    );

    document.getElementById("days").textContent = days;

    document.getElementById("hours").textContent = hours;

    document.getElementById("minutes").textContent = minutes;

    document.getElementById("seconds").textContent = seconds;

    examDateText.textContent = `Exam Date: ${new Date(examDate).toLocaleDateString()}`;

    const totalDays = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
        examStatus.textContent = "🔴 Exam is today!";
    } else if (totalDays <= 3) {
        examStatus.textContent = "🟡 Exam is very close!";
    } else {
        examStatus.textContent = "🟢 Exam is coming up";
    }

}

setInterval(updateCountdown, 1000);
updateCountdown();




// ===============================
// CHANGE EXAM DATE
// ===============================

const changeExamBtn =
    document.getElementById("changeExamBtn");

if (changeExamBtn) {
    changeExamBtn.addEventListener("click", function () {

        const newDate =
            prompt("Enter the new exam date (e.g. October 25, 2026):");

        if (newDate) {

            examDate =
                new Date(newDate + " 09:00:00").getTime();

            localStorage.setItem("studyHubExamDate", examDate);

            alert("Exam date changed successfully!");

        }

    });
}



// ===============================
// GPA CALCULATOR
// ===============================

// Store GPA courses
let courses = JSON.parse(localStorage.getItem("gpaCourses")) || [];

// Get HTML elements
const addGradeBtn = document.getElementById("addGradeBtn");
const gradeList = document.getElementById("gradeList");

const calculateGpaBtn = document.getElementById("calculateGpaBtn");
const gpaResult = document.getElementById("gpaResult");

// Display GPA courses
function displayGPACourses() {
    if (!gradeList) return;
    gradeList.innerHTML = "";

    courses.forEach(function (course, index) {
        const gradeItem = document.createElement("div");

        gradeItem.classList.add("grade-item");

        gradeItem.innerHTML = `
            <span>${course.name}</span>
            <span>Grade: ${course.gradeText}</span>
            <span>${course.creditUnit} Units</span>
            <button class="delete-course">Delete</button>
        `;

        const deleteButton = gradeItem.querySelector(".delete-course");

        deleteButton.addEventListener("click", function () {
            courses.splice(index, 1);

            localStorage.setItem(
                "gpaCourses",
                JSON.stringify(courses)
            );

            updateStatistics();
            displayGPACourses();
        });

        gradeList.appendChild(gradeItem);
    });
}


// Add a GPA course
if (addGradeBtn) {
    addGradeBtn.addEventListener("click", function () {

        const courseName =
            document.getElementById("courseName").value;

        const gradeSelect =
            document.getElementById("grade");

        const grade =
            Number(gradeSelect.value);

        const gradeText =
            gradeSelect.options[gradeSelect.selectedIndex].text;

        const creditUnit =
            Number(document.getElementById("creditUnit").value);

        // Check the inputs
        if (
            courseName === "" ||
            gradeSelect.value === "" ||
            creditUnit <= 0
        ) {

            alert("Please fill in all fields.");

            return;
        }

        // Create course
        const course = {

            name: courseName,

            grade: grade,

            gradeText: gradeText,

            creditUnit: creditUnit

        };

        // Add course to the array
        courses.push(course);

        updateStatistics();

        // Save courses
        localStorage.setItem(
            "gpaCourses",
            JSON.stringify(courses)
        );

        // Display courses
        displayGPACourses();

        // Clear inputs
        document.getElementById("courseName").value = "";

        document.getElementById("grade").value = "";

        document.getElementById("creditUnit").value = "";

        // Update GPA
        calculateGPA();

    });
}

// Calculate GPA
function calculateGPA() {

    if (!gpaResult) return;

    if (courses.length === 0) {

        gpaResult.textContent = "0.00";

        return;
    }

    let totalGradePoints = 0;

    let totalCreditUnits = 0;

    courses.forEach(function (course) {

        totalGradePoints +=
            course.grade * course.creditUnit;

        totalCreditUnits +=
            course.creditUnit;

    });

    const gpa =
        totalGradePoints / totalCreditUnits;

    gpaResult.textContent =
        gpa.toFixed(2);
}

// Calculate button
if (calculateGpaBtn) {
    calculateGpaBtn.addEventListener("click", function () {

        calculateGPA();

    });
}

// Load saved courses
displayGPACourses();

calculateGPA();




// ===============================
// ASSIGNMENT SYSTEM
// ===============================

// Store assignments
let assignments =
    JSON.parse(localStorage.getItem("assignments")) || [];

// Get HTML elements
const addAssignmentBtn =
    document.getElementById("addAssignmentBtn");

const assignmentList =
    document.getElementById("assignmentList");

// Display assignments
function displayAssignments() {

    if (!assignmentList) return;

    assignmentList.innerHTML = "";

    assignments.forEach(function (assignment) {

        const assignmentItem =
            document.createElement("div");

        assignmentItem.classList.add("assignment-item");

        assignmentItem.innerHTML = `
            <div class="assignment-info">
                <h3>${assignment.name}</h3>

                <p>
                    ${assignment.course}
                    | Due: ${assignment.dueDate}
                </p>
            </div>

            <div class="assignment-buttons">

                <button class="complete-assignment">
                    ${assignment.completed ? "Completed" : "Complete"}
                </button>

                <button class="delete-assignment complete-assignment">
                    Delete
                </button>

            </div>
        `;

        // Make completed assignments look different
        if (assignment.completed) {

            assignmentItem.style.opacity = "0.6";

        }

        assignmentList.appendChild(assignmentItem);

    });

}

// Add an assignment
if (addAssignmentBtn) {
    addAssignmentBtn.addEventListener("click", function () {

        const assignmentName =
            prompt("Enter the assignment name:");

        const courseName =
            prompt("Enter the course name:");

        const dueDate =
            prompt("Enter the due date:");

        if (assignmentName && courseName && dueDate) {

            const assignment = {

                name: assignmentName,

                course: courseName,

                dueDate: dueDate,

                completed: false

            };

            assignments.push(assignment);

            // Save assignments
            localStorage.setItem(
                "assignments",
                JSON.stringify(assignments)
            );

            // Display assignments
            displayAssignments();

        }

    });

}

// Mark assignment as completed
document.addEventListener("click", function (event) {

    if (
        event.target.classList.contains(
            "complete-assignment"
        )
    ) {

        const assignmentItem =
            event.target.parentElement;

        const items =
            Array.from(assignmentList.children);

        const index =
            items.indexOf(assignmentItem);

        assignments[index].completed = true;

        // Save updated assignments
        localStorage.setItem(
            "assignments",
            JSON.stringify(assignments)
        );

        // Refresh the list
        displayAssignments();

        updateStatistics();

    }

});

// Delete assignment
document.addEventListener("click", function (event) {

    if (
        event.target.classList.contains("delete-assignment")
    ) {

        const assignmentItem =
            event.target.closest(".assignment-item");

        const items =
            Array.from(assignmentList.children);

        const index =
            items.indexOf(assignmentItem);

        assignments.splice(index, 1);

        localStorage.setItem(
            "assignments",
            JSON.stringify(assignments)
        );

        displayAssignments();

        updateStatistics();

    }

});

// Load saved assignments
displayAssignments();




// =========================
// DASHBOARD STATISTICS
// =========================

function updateStatistics() {

    if (!document.getElementById("courseCount")) return;

    // Total courses
    document.getElementById("courseCount").textContent = courseData.length;

    // Total assignments
    const completedAssignments =
        assignments.filter(function (assignment) {
            return assignment.completed;
        }).length;

    document.getElementById("assignmentCount").textContent =
        completedAssignments + " / " + assignments.length;

    // Total exams
    document.getElementById("examCount").textContent = 1;

    // Current GPA
    let totalQualityPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        totalQualityPoints += course.grade * course.creditUnit;
        totalCredits += course.creditUnit;
    });

    let gpa = totalCredits > 0
        ? totalQualityPoints / totalCredits
        : 0;

    document.getElementById("dashboardGpa").textContent = gpa.toFixed(2);
}

updateStatistics();


// Study Plan buttons
const studyPlanButtons = document.querySelectorAll(".study-btn");

studyPlanButtons.forEach((button, index) => {

    // Restore saved status
    const savedStatus = localStorage.getItem(`study-${index}`);

    if (savedStatus === "completed") {
        button.textContent = "Completed";
        button.dataset.completed = "true";
        button.closest(".study-item").classList.add("completed");
    } else if (savedStatus === "started") {
        button.textContent = "Start";
        button.dataset.completed = "false";
    } else {
        button.textContent = "Start";
        button.dataset.completed = "false";
    }


    // Button click
    button.addEventListener("click", () => {
        const studyItem = button.closest(".study-item");

        if (button.dataset.completed === "true") {
            button.textContent = "Start";
            button.dataset.completed = "false";
            studyItem.classList.remove("completed");

            localStorage.setItem(`study-${index}`, "started");
        } else {
            button.textContent = "Completed";
            button.dataset.completed = "true";
            studyItem.classList.add("completed");

            localStorage.setItem(`study-${index}`, "completed");
        }
    });
});



// ==========================
// STUDY PROGRESS
// ==========================

function updateProgress() {

    if (!document.getElementById("progress")) return;
    if (!document.getElementById("progressText")) return;

    const buttons = document.querySelectorAll(".study-item button");

    let completed = 0;

    buttons.forEach(function (button) {

        if (button.textContent === "Completed") {
            completed++;
        }

    });

    let progress = 0;

    if (buttons.length > 0) {
        progress = Math.round((completed / buttons.length) * 100);
    }

    document.getElementById("progress").style.width = progress + "% completed";

    document.getElementById("progressText").textContent = progress + "% completed";

}

// Update progress when page loads
updateProgress();



// EXAM NOTES
const examNotes = document.getElementById("examNotes");
const saveExamNotes = document.getElementById("saveExamNotes");
const notesMessage = document.getElementById("notesMessage");

if (saveExamNotes) {
    saveExamNotes.addEventListener("click", function () {

        localStorage.setItem("examNotes", examNotes.value);
        notesMessage.textContent = "Notes saved successfully.";

    });

    const savedNotes = localStorage.getItem("examNotes");

    if (savedNotes) {
        examNotes.value = savedNotes;
    }

}




// Study Schedule
const studySubject = document.getElementById("studySubject");
const studyDate = document.getElementById("studyDate");
const studyTime = document.getElementById("studyTime");
const addStudySession = document.getElementById("addStudySession");
const studySessions = document.getElementById("studySessions");

if (addStudySession) {
    addStudySession.addEventListener("click", function () {
        const subject = studySubject.value.trim();
        const date = studyDate.value;
        const time = studyTime.value;

        if (subject === "" || date === "" || time === "") {
            alert("Please fill in all the study session details");
            return;
        }

        const session = document.createElement("div");
        session.classList.add("study-session")

        session.innerHTML = `
    <h3>${subject}</h3>
    <p>Date: ${date}</p>
    <p>Time: ${time}</p>
    <button class="delete-session">Delete</button>
`;

        session.querySelector(".delete-session").addEventListener("click", function () {
            session.remove();
            saveStudySessions();
        });

        studySessions.appendChild(session);

        saveStudySessions();

        studySubject.value = "";
        studyDate.value = "";
        studyTime.value = "";
    });
}


function saveStudySessions() {
    localStorage.setItem(
        "studySessions",
        studySessions.innerHTML
    );
}


function loadStudySessions() {

    if (!studySessions) return;

    const savedSessions = localStorage.getItem("studySessions");

    if (savedSessions) {
        studySessions.innerHTML = savedSessions;
    }
}

loadStudySessions();


function addDeleteButtons() {

    if (!studySessions) {
        return;
    }

    const sessions = studySessions.querySelectorAll(".study-sessions");

    sessions.forEach(function (session) {
        if (session.querySelector(".delete-session")) {
            return;
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-session");

        deleteButton.addEventListener("click", function () {
            session.remove();
            saveStudySessions();
        });

        session.appendChild(deleteButton);
    });
}

addDeleteButtons();





const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("loginName").value.trim();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!name || !email || !password) {
            document.getElementById("loginMessage").textContent =
                "Please fill in all fields.";
            return;
        }

        // Demo only: this does not securely authenticate an account.
        localStorage.setItem("studyHubUserName", name);
        localStorage.setItem("studyHubUserEmail", email);

        window.location.href = "index.html";
    });
}



const welcomeUser = document.getElementById("welcomeUser");

if (welcomeUser) {

    const savedName = localStorage.getItem("studyHubUserName");

    if (savedName) {

        const hour = new Date().getHours();
        let greeting;

        if (hour < 12) {
            greeting = "Good Morning";
        } else if (hour < 17) {
            greeting = "Good afternoon";
        } else {
            greeting = "Good evening"
        }

        welcomeUser.textContent = `${greeting} , ${savedName}`;

    }

}


const profileName = document.getElementById("profileName");

if (profileName) {
    const savedName = localStorage.getItem("studyHubUserName");

    if (savedName) {
        profileName.textContent = savedName;
    }
}


const profileDisplayName = document.getElementById("profileDisplayName");
const profileEmail = document.getElementById("profileEmail");

const savedName = localStorage.getItem("studyHubUserName");
const savedEmail = localStorage.getItem("studyHubUserEmail");

if (profileDisplayName && savedName) {
    profileDisplayName.textContent = savedName;
}

if (profileEmail && savedEmail) {
    profileEmail.textContent = savedEmail;
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        const confirmLogout = confirm("Are you sure you want to logout?");

        if (confirmLogout) {
            window.location.href = "login.html"
        }
    });
}




document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const registerMessage = document.getElementById("registerMessage");

        if (!name || !email || !password || !confirmPassword) {
            registerMessage.textContent = "Please fill in all fields.";
            return;
        }

        if (password.length < 8) {
            registerMessage.textContent =
                "Your password must contain at least 8 characters.";
            return;
        }

        if (password !== confirmPassword) {
            registerMessage.textContent = "Your passwords do not match.";
            return;
        }

        let accounts = JSON.parse(localStorage.getItem("studyHubAccounts") || "[]");

        if (accounts.some(account => account.email === email)) {
            registerMessage.textContent =
                "An account with this email already exists.";
            return;
        }

        // Demo only: do not store real passwords this way.
        accounts.push({ name: name, email: email, password: password });
        localStorage.setItem("studyHubAccounts", JSON.stringify(accounts));

        registerMessage.textContent =
            "Account created! Redirecting to login...";

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1000);
    });
});




const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        alert("Registration form validated successfully!");
    });
}
