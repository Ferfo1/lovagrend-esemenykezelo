// Globális változó, amely tárolja az eseményeket
let events = [];

document.addEventListener('DOMContentLoaded', function () {
  loadEvents().then(loadUpcomingEvents);
});

function loadUpcomingEvents() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = ''; // Törölje a korábbi naptárat

  // Csak a következő 5 eseményt jelenítse meg
  const upcomingEvents = getUpcomingEvents(5);

  if (upcomingEvents.length > 0) {
    // Van közeljövőbeli esemény
    for (let event of upcomingEvents) {
      const eventElement = document.createElement('div');
      eventElement.classList.add('event');
      eventElement.innerHTML = `<strong>${event.name}</strong><br>
        Dátum: ${event.startDate} - ${event.endDate}<br>
        Idő: ${event.startTime} - ${event.endTime}<br>
        Hely: ${event.location}<br>
        Város: ${event.city}<br>
        Program: <a href="#" onclick="openProgram('${event.program}')">Nézd meg a programot</a>`;
      calendar.appendChild(eventElement);
    }
  } else {
    // Nincs közeljövőbeli esemény
    const noEventElement = document.createElement('div');
    noEventElement.classList.add('no-event');
    noEventElement.innerText = 'A közeljövőben nincs esemény.';
    calendar.appendChild(noEventElement);
  }
}

function getUpcomingEvents(limit) {
  const today = new Date();
  const upcomingEvents = events
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .filter(event => new Date(event.endDate) >= today)
    .slice(0, limit);
  return upcomingEvents;
}

// Az események betöltése a szerverről
function loadEvents() {
  return fetch('load_events.php')
    .then(response => response.json())
    .then(data => {
      events = data;
      return data; // Promise-t ad vissza, hogy lássuk, hogy a betöltés befejeződött
    })
    .catch(error => {
      console.error('Error loading events:', error);
    });
}

function openProgram(pdfFileName) {
    const pdfUrl = `files/${pdfFileName}`;
    window.open(pdfUrl, '_blank');
  }
  

function saveEvents(events) {
  // AJAX kérés az események mentéséhez
  fetch('save_events.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ events }),
  })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        console.error('Error saving events:', data.error);
      }
    })
    .catch(error => {
      console.error('Error saving events:', error);
    });
}

function addEvent() {
  try {
    const eventName = document.getElementById('eventName').value;
    const eventStartDate = document.getElementById('eventStartDate').value;
    const eventEndDate = document.getElementById('eventEndDate').value;
    const eventStartTime = document.getElementById('eventStartTime').value;
    const eventEndTime = document.getElementById('eventEndTime').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventCity = document.getElementById('eventCity').value;
    const eventProgramInput = document.getElementById('eventProgram');

    // Ellenőrizze, hogy a PDF fájl kiválasztva van-e
    if (!eventProgramInput.files || eventProgramInput.files.length === 0) {
      alert('Please select a PDF file for the event program.');
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', eventProgramInput.files[0]);
    formData.append('eventName', eventName);
    formData.append('eventStartDate', eventStartDate);
    formData.append('eventEndDate', eventEndDate);
    formData.append('eventStartTime', eventStartTime);
    formData.append('eventEndTime', eventEndTime);
    formData.append('eventLocation', eventLocation);
    formData.append('eventCity', eventCity);

    // AJAX kérés a PDF fájl feltöltéséhez és az esemény hozzáadásához
    fetch('upload.php', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Sikeres feltöltés esetén hozzáadja az eseményt
          const newEvent = {
            name: eventName,
            startDate: eventStartDate,
            endDate: eventEndDate,
            startTime: eventStartTime,
            endTime: eventEndTime,
            location: eventLocation,
            city: eventCity,
            program: data.fileName
          };

          events.push(newEvent);

          // Események mentése
          saveEvents(events);

          // Close the add event modal
          closeAddEventModal();

          // Reload the calendar to update the displayed events
          loadUpcomingEvents();
        } else {
          // Hibaüzenet megjelenítése
          alert('Error uploading file: ' + data.error);
        }
      })
      .catch(error => {
        // Hibaüzenet megjelenítése a konzolon
        console.error('Error during file upload and event addition:', error);
      });
  } catch (error) {
    // Hibaüzenet megjelenítése a konzolon
    console.error('Error in addEvent function:', error);
  }
}

function openAddEventModal() {
  const modal = document.getElementById('addEventModal');
  modal.style.display = 'block';
}

function closeAddEventModal() {
  const modal = document.getElementById('addEventModal');
  modal.style.display = 'none';
}
