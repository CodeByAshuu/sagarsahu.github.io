---
title: SyllabiSync
excerpt: SyllabiSync is a smart platform designed to help students easily explore and compare college syllabi across AICTE-approved institutions in India. With a sleek interface and powerful filters, it simplifies academic planning by offering centralized access to updated curriculum details, institute information, and course structures—all in one place.

iframe: //www.youtube.com/embed/EnfVwjyI6Zc?si=7DysY6PgyYiJWBUs
demo: //CodeByAshuu.github.io/SyllabiSync
src: //github.com/CodeByAshuu/SyllabiSync

info:
  idea: The basic idea of the project is to a build a unified portal for model curriculum for all the AICTE approved Insititutes.
  tech: [HTML5 , CSS3, TailwindCSS, JavaScript, jQuery, PHP, MySQL, XAMPP]
  links:
    - [Freepik | minimalistic images,https://www.freepik.com/,]
    - [AICTE Official Site, https://www.aicte-india.org/]
    - [AICTE Universities API, https://www.aicte-india.org/education/institutions/Universities]
---
## Problem Statement
In India, thousands of educational institutions offer diverse academic programs. However, a major challenge faced by both students and faculty is:

- Scattered and unorganized curriculum information
- Difficulty in comparing or accessing syllabus structures
- Lack of a centralized academic content repository
- Time-consuming syllabus approval processes

This fragmentation makes it harder for educators to innovate and for students to stay updated with consistent academic frameworks.

## Tech Stack
- **FrontEnd**
  - HTML
  - CSS
  - Tailwind CSS
  - JavaScript
- **BackEnd**
  - PHP
  - XAMPP
- **Database**
  - MySQL

## 🚀 Features
- **User Authentication** (Login/Register) for Teacher/Faculty/Students
- **Admin Panel** for curriculum management
- **Notification and Email** options
- **Upload, View & Edit** model curricula
- **Search & Filter** syllabus efficiently
- **Responsive UI** with TailwindCSS
- **Secure Database** integration with PHP & MySQL

## How It Works?

This  unified portal for model curriculum designed for all AICTE-approved institutions. This platform ensures standardized curriculum development, seamless sharing, and easy updates, improving the quality and consistency of technical education in India.


The `home page` offers a clean, intuitive layout that guides users into the platform depending on their role — student, teacher, or administrator.

Moving to the Curriculum page, user needs to first login as a student (can be personal or university id's)

First, The Faculty will create a Syllabus, by choosing the University they are from, the subject they are drafting the syllabus for and the stream.

```php {11-13}
teacherStmt = $conn->prepare("SELECT id_number, university_name FROM teachers WHERE id = ?");
$teacherStmt->bind_param("i", $_SESSION['teacher_id']);
$teacherStmt->execute();
$teacherResult = $teacherStmt->get_result();

if ($teacherResult->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Teacher not found']);
    exit;
}

$teacher = $teacherResult->fetch_assoc();
$idNumber = $teacher['id_number'];
$universityName = $teacher['university_name'];
//new code end 

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_FILES["pdf"])) {
        // Validate file type
        $fileType = strtolower(pathinfo($_FILES["pdf"]["name"], PATHINFO_EXTENSION));
        if ($fileType !== "pdf") {
            http_response_code(400);
            echo json_encode(["message" => "Only PDF files are allowed."]);
            exit;
        }

        $uploadDir = "uploads/";
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                http_response_code(500);
                echo json_encode(["message" => "Could not create upload directory."]);
                exit;
            }
        }

        // Generate unique filename to prevent overwrites
        $filename = uniqid() . '_' . basename($_FILES["pdf"]["name"]);
        $target = $uploadDir . $filename;

        if (move_uploaded_file($_FILES["pdf"]["tmp_name"], $target)) {
            // Prepare SQL statement to prevent SQL injection
            $stmt = $conn->prepare("INSERT INTO syllabus_approvals (file_name, teacher_id, university_name) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $filename, $idNumber, $universityName);
            
            if ($stmt->execute()) {
                echo json_encode([
                    "message" => "Success", 
                    "filename" => $filename,
                    "id" => $stmt->insert_id
                ]);
            } else {
                // Delete the uploaded file if DB insert fails
                unlink($target);
                http_response_code(500);
                echo json_encode(["message" => "Database error: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Could not save file."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "No PDF uploaded."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Only POST allowed."]);
}

$conn->close();
```
after creating a syllabus, Admin is notified.

Admin checks the syllabus , if admin feels gooood he accepts the syllabus which then goes to the accepted syallbus , which is shown in `Curriculum page` .

In Curriculum page a student, teacher or faculty can use `filters`, to `search` a curriculum syllabus.

> This is done using the MySQL database.

```php
$servername = "localhost";
$username = "root";
$password = "";
$database = "frontend&backend";

$conn = mysqli_connect($servername, $username, $password, $database);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$stream = isset($_GET['stream']) ? $_GET['stream'] : '';
$subject = isset($_GET['subject_name']) ? $_GET['subject_name'] : '';

$query = "SELECT * FROM syllabus_approvals WHERE status='Approved'";
if (!empty($stream)) {
    $query .= " AND stream = '" . mysqli_real_escape_string($conn, $stream) . "'";
}
if (!empty($subject)) {
    $query .= " AND subject_name = '" . mysqli_real_escape_string($conn, $subject) . "'";
}
$result = mysqli_query($conn, $query);

$stream_options = mysqli_query($conn, "SELECT DISTINCT stream FROM syllabus_approvals WHERE status='Approved'");
$subject_options = mysqli_query($conn, "SELECT DISTINCT subject_name FROM syllabus_approvals WHERE status='Approved'");
```

After the syllabus is filtered, You can either Download, Share or open it in the Browser.

You can see list of AICTE approved Universities and learn more about them on [AICTE Universities](https://www.aicte-india.org/education/institutions/Universities)


And that's it, phew, that was a lot of work. But in the end, we have beautiful wesbite, have fun watching syllabus all day. <3