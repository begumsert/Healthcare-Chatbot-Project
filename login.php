<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $email = $_POST['email'];
    $password = $_POST['password'];

    
    $file = fopen("users.txt", "r");

    $isLoginSuccessful = false;

    
    while (($line = fgets($file)) !== false) {
        
        list($userName, $userEmail, $userPassword) = explode(",", $line);

        
        if (trim($email) == trim($userEmail) && password_verify($password, trim($userPassword))) {
            $isLoginSuccessful = true;
            break;
        }
    }
    fclose($file);

    
    if ($isLoginSuccessful) {
        header("Location: index2.html");
        exit();
    } else {
        echo "Invalid email or password.";
    }
}
?>

