<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Formdan gelen verileri al
    $name = $_POST['name'];
    $email = $_POST['email'];
	$password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Güvenlik için parolayı hashliyor

    // Bilgileri bir metin dosyasına kaydet
    $file = fopen("users.txt", "a"); // 'a' modu, dosyanın sonuna ekleme yapar
    fwrite($file, "$name, $email, $password\n");
    fclose($file);

    // Kullanıcıyı giriş sayfasına yönlendir
    header("Location: index.html");
    exit();
}
?>

