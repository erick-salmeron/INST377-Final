function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

    function injectHTML(list) {
        console.log('fired injectHTML');
        const target = document.querySelector('#building_list');
        target.innerHTML = '';
        list.forEach((item) => {
            const str = `<li>${item.name}</li>`;
            target.innerHTML += str
        });
    }

    function splitBuildingList(list) {
        console.log('fired building list');
        const range = [...Array(35).keys()];
        return newArray = range.map((item) => {
            const index = getRandomIntInclusive(0, list.length - 1);
            return list[index]
        })
    }

    /* A quick filter that will return something based on a matching input */
    function filterList(list, query) {
        return list.filter((item) => {
            const lowerCaseName = item.name.toLowerCase();
            const lowerCaseQuery = query.toLowerCase();
            return lowerCaseName.includes(lowerCaseQuery);
        })
    }

    function initMap() {
        const map = L.map("map").setView([38.98, -76.93], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
    }

    function markerPlace(array, map) {
        console.log("array for markers", array);
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            layer.remove();
          }
        });
      
        array.forEach((item) => {
          console.log("markerPlace", item);
          const lat = item.lat;
          const long = item.long;
      
          L.marker([lat, long]).addTo(map);
        });
      }


    async function mainEvent() { // the async keyword means we can make API requests
        const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
        const loadDataButton = document.querySelector("#data_load");
        const clearDataButton = document.querySelector('#data_clear');
        const generateListButton = document.querySelector("#generate");
        const textField = document.querySelector("#build");

        generateListButton.classList.add("hidden");

        const map = initMap();

        const storedData = localStorage.getItem('storedData');
        let parsedData = JSON.parse(storedData);
        if (parsedData?.length > 0) {
            generateListButton.classList.remove('hidden');
        }

        let currentList = []; // this is "scoped" to the main event function

        /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
        loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
            console.log('loading data');

            /*
              ## GET requests and Javascript
                We would like to send our GET request so we can control what we do with the results
                Let's get those form results before sending off our GET request using the Fetch API
            
              ## Retrieving information from an API
                The Fetch API is relatively new,
                and is much more convenient than previous data handling methods.
                Here we make a basic GET request to the server using the Fetch method to the county
            */

            // Basic GET request - this replaces the form Action
            const results = await fetch('https://api.umd.io/v1/map/buildings');

            // This changes the response from the GET into data we can use - an "object"
            const storedList = await results.json();
            localStorage.setItem('storedData', JSON.stringify(storedList));

            if (parsedData?.length > 0) {
                generateListButton.classList.remove("hidden");
            }
            //console.table(storedList);
        });

        generateListButton.addEventListener("click", (event) => {
            console.log("generate new list");
            currentList = splitBuildingList(parsedData);
            console.log(currentList);
            injectHTML(currentList);
            markerPlace(currentList, map);
        });

        textField.addEventListener("input", (event) => {
            console.log("input", event.target.value);
            const newList = filterList(currentList, event.target.value);
            console.log(newList);
            injectHTML(newList);
            markerPlace(newList, map);
        });

        clearDataButton.addEventListener("click", (event) => {
            console.log('clear browser data');
            localStorage.clear
            console.log('localStorage Check', localStorage.getItem("storedData"))
        })

    }

    /*
      This adds an event listener that fires our main event only once our page elements have loaded
      The use of the async keyword means we can "await" events before continuing in our scripts
      In this case, we load some data when the form has submitted
    */
    document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests