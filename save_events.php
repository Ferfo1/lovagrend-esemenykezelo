<?php
function saveEvents($events) {
    $eventsFilePath = 'files/events.json';
    $jsonEvents = json_encode($events, JSON_PRETTY_PRINT);
    file_put_contents($eventsFilePath, $jsonEvents);
}

// Ellenőrzi, hogy a POST kérés tartalmazza-e az eseményeket
if(isset($_POST['events'])) {
    $events = json_decode($_POST['events'], true);

    // Események mentése
    saveEvents($events);

    echo json_encode(array('success' => true));
} else {
    // Hiba: nincsenek események a POST adatokban
    echo json_encode(array('success' => false, 'error' => 'No events received.'));
}
?>
