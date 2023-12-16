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

if (isset($_FILES['pdfFile'])) {
    $errors = array();

    $allowedFileTypes = ['pdf', 'doc', 'docx'];
    $fileExtension = pathinfo($_FILES['pdfFile']['name'], PATHINFO_EXTENSION);

    if (!in_array(strtolower($fileExtension), $allowedFileTypes)) {
        echo json_encode(array('success' => false, 'error' => 'Invalid file type.'));
        exit;
    }

    $pdfFileName = time() . '_' . $_FILES['pdfFile']['name'];
    $uploadPath = 'files/' . $pdfFileName;

    if (move_uploaded_file($_FILES['pdfFile']['tmp_name'], $uploadPath)) {
        echo json_encode(array('success' => true, 'fileName' => $pdfFileName));

        $events = loadEvents();

        $newEvent = array(
            'name' => $_POST['eventName'],
            'startDate' => $_POST['eventStartDate'],
            'endDate' => $_POST['eventEndDate'],
            'startTime' => $_POST['eventStartTime'],
            'endTime' => $_POST['eventEndTime'],
            'location' => $_POST['eventLocation'],
            'city' => $_POST['eventCity'],
            'program' => $pdfFileName,
            'phoneNumber' => $_POST['eventPhoneNumber'],
            'comments' => $_POST['eventComments']
        );

        $events[] = $newEvent;

        saveEvents($events);
    } else {
        echo json_encode(array('success' => false, 'error' => 'Error uploading file.'));
    }
} else {
    echo json_encode(array('success' => false, 'error' => 'No file received.'));
}
?>
