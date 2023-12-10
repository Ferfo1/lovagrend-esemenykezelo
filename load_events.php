<?php
function loadEvents() {
    $eventsFilePath = 'files/events.json';
    if (file_exists($eventsFilePath)) {
        $jsonEvents = file_get_contents($eventsFilePath);
        return json_decode($jsonEvents, true);
    }
    return [];
}

echo json_encode(loadEvents(), JSON_PRETTY_PRINT);
?>
