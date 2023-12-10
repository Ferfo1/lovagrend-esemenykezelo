<?php
function saveEvents($events) {
    $eventsFilePath = 'files/events.json';
    $jsonEvents = json_encode($events, JSON_PRETTY_PRINT);
    file_put_contents($eventsFilePath, $jsonEvents);
}

function loadEvents() {
    $eventsFilePath = 'files/events.json';
    if (file_exists($eventsFilePath)) {
        $jsonEvents = file_get_contents($eventsFilePath);
        return json_decode($jsonEvents, true);
    }
    return [];
}

// Ellenőrzi, hogy a form elküldte-e a fájlt
if(isset($_FILES['pdfFile'])) {
    $errors = array();

    // Fájlnév generálása
    $pdfFileName = time() . '_' . $_FILES['pdfFile']['name'];
    $uploadPath = 'files/' . $pdfFileName;

    // Fájl feltöltése
    if(move_uploaded_file($_FILES['pdfFile']['tmp_name'], $uploadPath)) {
        // Sikeres feltöltés
        echo json_encode(array('success' => true, 'fileName' => $pdfFileName));
        
        // Események betöltése
        $events = loadEvents();

        // Új esemény hozzáadása
        $newEvent = array(
            'name' => $_POST['eventName'],
            'startDate' => $_POST['eventStartDate'],
            'endDate' => $_POST['eventEndDate'],
            'startTime' => $_POST['eventStartTime'],
            'endTime' => $_POST['eventEndTime'],
            'location' => $_POST['eventLocation'],
            'city' => $_POST['eventCity'],
            'program' => $pdfFileName
        );

        $events[] = $newEvent;

        // Események mentése
        saveEvents($events);
    } else {
        // Sikertelen feltöltés
        echo json_encode(array('success' => false, 'error' => 'Error uploading file.'));
    }
} else {
    // Hiba: nem érkezett fájl
    echo json_encode(array('success' => false, 'error' => 'No file received.'));
}
?>
