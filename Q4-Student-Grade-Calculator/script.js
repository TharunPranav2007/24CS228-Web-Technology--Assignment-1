/* =========================================================
   STUDENT GRADE CALCULATOR
   ========================================================= */


/* =========================================================
   1. GET HTML ELEMENTS
   ========================================================= */

const studentName = document.getElementById("studentName");

const rollNumber = document.getElementById("rollNumber");

const calculateBtn = document.getElementById("calculateBtn");

const resetBtn = document.getElementById("resetBtn");

const errorMessage = document.getElementById("errorMessage");

const resultSection = document.getElementById("resultSection");

const resultStudent = document.getElementById("resultStudent");

const totalMarks = document.getElementById("totalMarks");

const averageMarks = document.getElementById("averageMarks");

const grade = document.getElementById("grade");

const passStatus = document.getElementById("passStatus");

const statusBadge = document.getElementById("statusBadge");

const subjectResultList =
    document.getElementById("subjectResultList");


/* =========================================================
   2. SUBJECT NAMES
   ========================================================= */

/*
    This is an Array.

    It stores the names of the five subjects.
*/

const subjects = [
    "Subject 1",
    "Subject 2",
    "Subject 3",
    "Subject 4",
    "Subject 5"
];


/* =========================================================
   3. GET MARKS
   ========================================================= */

/*
    This user-defined function reads the marks
    entered by the student.

    Function:
    getMarks()

    Return:
    An array containing five marks.
*/

function getMarks() {

    const marks = [];

    for (let i = 1; i <= 5; i++) {

        const input =
            document.getElementById(`subject${i}`);

        const mark =
            Number(input.value);

        marks.push(mark);
    }

    return marks;
}


/* =========================================================
   4. VALIDATE MARKS
   ========================================================= */

/*
    This function checks whether all marks
    are valid.

    Valid range:
    0 to 100
*/

function validateMarks(marks) {

    for (let i = 0; i < marks.length; i++) {

        if (
            Number.isNaN(marks[i]) ||
            marks[i] < 0 ||
            marks[i] > 100
        ) {

            return false;
        }
    }

    return true;
}


/* =========================================================
   5. CALCULATE TOTAL
   ========================================================= */

/*
    This function uses iteration to add
    all five subject marks.
*/

function calculateTotal(marks) {

    let total = 0;

    for (let i = 0; i < marks.length; i++) {

        total = total + marks[i];
    }

    return total;
}


/* =========================================================
   6. CALCULATE AVERAGE
   ========================================================= */

function calculateAverage(total, numberOfSubjects) {

    return total / numberOfSubjects;
}


/* =========================================================
   7. DETERMINE GRADE
   ========================================================= */

/*
    Grade criteria:

    90 - 100 : A+
    80 - 89  : A
    70 - 79  : B
    60 - 69  : C
    50 - 59  : D
    Below 50 : F
*/

function calculateGrade(average) {

    if (average >= 90) {

        return "A+";

    } else if (average >= 80) {

        return "A";

    } else if (average >= 70) {

        return "B";

    } else if (average >= 60) {

        return "C";

    } else if (average >= 50) {

        return "D";

    } else {

        return "F";
    }
}


/* =========================================================
   8. DETERMINE PASS / FAIL
   ========================================================= */

/*
    A student must score at least 40
    in every subject to pass.

    This function uses iteration and selection.
*/

function determineStatus(marks) {

    for (let i = 0; i < marks.length; i++) {

        if (marks[i] < 40) {

            return "FAIL";
        }
    }

    return "PASS";
}


/* =========================================================
   9. DISPLAY SUBJECT RESULTS
   ========================================================= */

function displaySubjectResults(marks) {

    subjectResultList.innerHTML = "";

    for (let i = 0; i < marks.length; i++) {

        const row =
            document.createElement("div");

        row.className = "subject-row";


        const name =
            document.createElement("span");

        name.className = "subject-name";

        name.textContent = subjects[i];


        const mark =
            document.createElement("span");

        mark.className = "subject-mark";

        mark.textContent = marks[i];


        const status =
            document.createElement("span");

        status.className = "subject-status";


        if (marks[i] >= 40) {

            status.textContent = "PASS";

            status.classList.add("pass");

        } else {

            status.textContent = "FAIL";

            status.classList.add("fail");
        }


        row.appendChild(name);

        row.appendChild(mark);

        row.appendChild(status);


        subjectResultList.appendChild(row);
    }
}


/* =========================================================
   10. CALCULATE BUTTON
   ========================================================= */

calculateBtn.addEventListener(
    "click",
    function () {

        /* Clear previous error */

        errorMessage.textContent = "";


        /* Get marks */

        const marks = getMarks();


        /* Validate marks */

        if (!validateMarks(marks)) {

            errorMessage.textContent =
                "Please enter valid marks between 0 and 100 for all five subjects.";

            resultSection.style.display = "none";

            return;
        }


        /* Calculate total */

        const total =
            calculateTotal(marks);


        /* Calculate average */

        const average =
            calculateAverage(
                total,
                marks.length
            );


        /* Calculate grade */

        const finalGrade =
            calculateGrade(average);


        /* Calculate pass/fail */

        const finalStatus =
            determineStatus(marks);


        /* Student name */

        const name =
            studentName.value.trim();


        /*
            Display student name.

            If no name was entered,
            use "Student".
        */

        if (name === "") {

            resultStudent.textContent =
                "Student Result";

        } else {

            resultStudent.textContent =
                `${name}'s Result`;
        }


        /* Display total */

        totalMarks.textContent =
            total;


        /* Display average */

        averageMarks.textContent =
            average.toFixed(2);


        /* Display grade */

        grade.textContent =
            finalGrade;


        /* Display status */

        passStatus.textContent =
            finalStatus;


        /* Update status badge */

        statusBadge.textContent =
            finalStatus;


        /*
            Remove previous status classes.
        */

        statusBadge.classList.remove(
            "pass",
            "fail"
        );


        /*
            Add class based on
            pass/fail result.
        */

        if (finalStatus === "PASS") {

            statusBadge.classList.add("pass");

        } else {

            statusBadge.classList.add("fail");
        }


        /* Display subject-wise results */

        displaySubjectResults(marks);


        /* Show result section */

        resultSection.style.display = "block";


        /*
            Scroll smoothly to the result.
        */

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =========================================================
   11. RESET BUTTON
   ========================================================= */

resetBtn.addEventListener(
    "click",
    function () {

        /* Clear student details */

        studentName.value = "";

        rollNumber.value = "";


        /* Clear subject marks */

        for (let i = 1; i <= 5; i++) {

            document.getElementById(
                `subject${i}`
            ).value = "";
        }


        /* Clear error */

        errorMessage.textContent = "";


        /* Hide result */

        resultSection.style.display = "none";


        /* Clear result values */

        totalMarks.textContent = "0";

        averageMarks.textContent = "0";

        grade.textContent = "—";

        passStatus.textContent = "—";

        statusBadge.textContent = "—";


        statusBadge.classList.remove(
            "pass",
            "fail"
        );


        /* Clear subject result list */

        subjectResultList.innerHTML = "";
    }
);