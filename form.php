<?php
require 'C:\Users\Monster\Desktop\BEGÜM\Chatbot Project\Chatbot111\Chatbot\vendor\autoload.php'; // MongoDB php kütüphanesi için

$client = new MongoDB\Client("mongodb://localhost:27017");
$collection = $client->health_database->users;

// Her bir form alanı için güvenli bir şekilde veri çekme ve varsayılan değer atama
$name = isset($_POST['name']) ? $_POST['name'] : 'Default Name';
$email = isset($_POST['email']) ? $_POST['email'] : 'No email provided';
$gender = isset($_POST['gender']) ? $_POST['gender'] : 'Not specified';
$birthdate = isset($_POST['birth_date']) ? $_POST['birth_date'] : 'Not specified';
$height = isset($_POST['height']) ? $_POST['height'] : 'Not specified';
$weight = isset($_POST['weight']) ? $_POST['weight'] : 'Not specified';
$blood_type = isset($_POST['blood_type']) ? $_POST['blood_type'] : 'Not specified';
$smoking_status = isset($_POST['smoking_status']) ? $_POST['smoking_status'] : 'Not specified';
$alcohol_consumption = isset($_POST['alcohol_consumption']) ? $_POST['alcohol_consumption'] : 'Not specified';
$current_medications = isset($_POST['current_medications']) ? $_POST['current_medications'] : 'Not specified';
$past_surgeries = isset($_POST['past_surgeries']) ? $_POST['past_surgeries'] : 'Not specified';
$chronic_conditions = isset($_POST['chronic_conditions']) ? $_POST['chronic_conditions'] : 'Not specified';
$family_history = isset($_POST['family_history']) ? $_POST['family_history'] : 'Not specified';
$food_allergies = isset($_POST['food_allergies']) ? $_POST['food_allergies'] : 'Not specified';
$diet_type = isset($_POST['diet_type']) ? $_POST['diet_type'] : 'Not specified';
$caffeine_consumption = isset($_POST['caffeine_consumption']) ? $_POST['caffeine_consumption'] : 'Not specified';
$diet_details = isset($_POST['diet_details']) ? $_POST['diet_details'] : 'Not specified';
$daily_fluid_intake = isset($_POST['daily_fluid_intake']) ? $_POST['daily_fluid_intake'] : 'Not specified';
$health_supplements = isset($_POST['health_supplements']) ? $_POST['health_supplements'] : 'Not specified';
$medication_allergies = isset($_POST['medication_allergies']) ? $_POST['medication_allergies'] : 'Not specified';
$recent_illnesses = isset($_POST['recent_illnesses']) ? $_POST['recent_illnesses'] : 'Not specified';
$recent_weight_change = isset($_POST['recent_weight_change']) ? $_POST['recent_weight_change'] : 'Not specified';
$exercise_frequency = isset($_POST['exercise_frequency']) ? $_POST['exercise_frequency'] : 'Not specified';
$sleep_issues = isset($_POST['sleep_issues']) ? $_POST['sleep_issues'] : 'Not specified';
$daily_stress_level = isset($_POST['daily_stress_level']) ? $_POST['daily_stress_level'] : 'Not specified';
$recent_injuries = isset($_POST['recent_injuries']) ? $_POST['recent_injuries'] : 'Not specified';
$psychiatric_treatment = isset($_POST['psychiatric_treatment']) ? $_POST['psychiatric_treatment'] : 'Not specified';
$recent_life_changes = isset($_POST['recent_life_changes']) ? $_POST['recent_life_changes'] : 'Not specified';
$recent_travel = isset($_POST['recent_travel']) ? $_POST['recent_travel'] : 'Not specified';
$consent = isset($_POST['consent']) ? $_POST['consent'] : 'No';

// Veri toplama
$data = [
    'name' => $name,
    'email' => $email,
    'gender' => $gender,
    'birthdate' => $birthdate,
    'height' => $height,
    'weight' => $weight,
    'blood_type' => $blood_type,
    'smoking_status' => $smoking_status,
    'alcohol_consumption' => $alcohol_consumption,
    'current_medications' => $current_medications,
    'past_surgeries' => $past_surgeries,
    'chronic_conditions' => $chronic_conditions,
    'family_history' => $family_history,
    'food_allergies' => $food_allergies,
    'diet_type' => $diet_type,
    'caffeine_consumption' => $caffeine_consumption,
    'diet_details' => $diet_details,
    'daily_fluid_intake' => $daily_fluid_intake,
    'health_supplements' => $health_supplements,
    'medication_allergies' => $medication_allergies,
    'recent_illnesses' => $recent_illnesses,
    'recent_weight_change' => $recent_weight_change,
    'exercise_frequency' => $exercise_frequency,
    'sleep_issues' => $sleep_issues,
    'daily_stress_level' => $daily_stress_level,
    'recent_injuries' => $recent_injuries,
    'psychiatric_treatment' => $psychiatric_treatment,
    'recent_life_changes' => $recent_life_changes,
    'recent_travel' => $recent_travel,
    'consent' => $consent
];

// MongoDB'ye veri ekleme
$result = $collection->insertOne($data);

if ($result->getInsertedCount() > 0) {
    echo 'Data successfully inserted into MongoDB.';
} else {
    echo 'An error occurred.';
}
?>
