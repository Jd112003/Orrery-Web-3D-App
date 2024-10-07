var step = 0;
var isUpdating = true;
var stepRotations = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var rotations = [];
var rotationsinverse = [];
var interval;
var cMercury = [];
var cVenus = [];
var cEarth = [];
var cMars = [];
var cJupiter = [];
var cSaturn = [];
var cUranus = [];
var cNeptune = [];
var cPluto = [];
const navInfo = document.getElementById('navInfo');
const pausa = document.getElementById('pausa');
function create(position, url, radio, name, isSaturn = false) {
    var tPlanet = document.createElement('Transform');
    tPlanet.setAttribute("translation", position.join(" "));
    tPlanet.setAttribute("id", name + 'Position');  // Asignar un ID único basado en el nombre del planeta


    if (isSaturn) {
        // Si es Saturno, cargamos el modelo X3D en lugar de una esfera
        tPlanet.setAttribute("scale", 0.02 + " " + 0.02 + " " + 0.02);
        var planet = document.createElement('inline');
        planet.setAttribute("url", url);  // Cargar el modelo X3D desde la URL proporcionada
        planet.setAttribute("id", name);
    } else {
        var planet = document.createElement('Shape');
        planet.setAttribute("id", name);
        var planetApp = document.createElement('Appearance');
        var planetMat = document.createElement('Material');
        planetMat.setAttribute("diffuseColor", "0 0 1");
        planetMat.setAttribute("emissiveColor", "0 0 0");
        planetApp.appendChild(planetMat);

        var planetModel = document.createElement('Sphere');
        planetModel.setAttribute("radius", radio);

        var texture = document.createElement('ImageTexture');
        texture.setAttribute("url", url);
        planetApp.appendChild(texture);

        planet.appendChild(planetApp);
        planet.appendChild(planetModel);
    }

    // Asignar el evento click usando el atributo onclick
    planet.setAttribute('onclick', `showInfoBox('${name}', event)`);

    tPlanet.appendChild(planet);
    document.getElementById('Objects').appendChild(tPlanet);
    return tPlanet;
}


async function startUpdate() {

    navInfo.setAttribute('Type', 'Examinate');

    // slider.js
    // Selecciona el elemento del rango y el elemento del valor
    const rangeSlider = document.getElementById('myRange');
    const sliderValueDisplay = document.querySelector('.PB-range-slidervalue');

    const solarMassSlider = document.getElementById('solarMass');
    const solarMassDisplay = document.querySelector('.PB-range-solarvalue');

    // Variable para almacenar el valor del slider como float
    let sliderValue = parseFloat(rangeSlider.value); // Inicializa el valor como float

    let solarMassValue = parseFloat(solarMassSlider.value); // Inicializa el valor como float
    pausa.addEventListener('click', function () {
        isUpdating = !isUpdating;

    });
    for (var i = 0; i < 1000; i++) {
        rotations.push(2 * Math.PI / 1000 * i);
    }
    rotationsinverse = rotations.slice().reverse();
    //All the partitions are based on the time that Pluto takes to complete a full orbit
    var time = [];
    for (var i = 0; i < 10000; i++) {
        time.push(90560 / 10000 * i);
    }

    var a0Mercury = nuevoSemiEjeMayorConFactor(0.38809893, solarMassValue);
    var a0Venus = nuevoSemiEjeMayorConFactor(0.72333199, solarMassValue);
    var a0Earth = nuevoSemiEjeMayorConFactor(1.00000261, solarMassValue);
    var a0Mars = nuevoSemiEjeMayorConFactor(1.52371034, solarMassValue);
    var a0Jupiter = 5.20288700;
    var a0Saturn = 9.53667594;
    var a0Uranus = 19.18916464;
    var a0Neptune = 30.06992276;
    var a0Pluto = 39.48211675;
    for (var i = 0; i < 10000; i++) {
        cMercury.push(calcularCoordenadasOrbitales(a0Mercury, 0.20563069, 7.00487, 48.33167, 77.45645, 87.969, time[i]));
        cVenus.push(calcularCoordenadasOrbitales(a0Venus, 0.00677323, 3.39471, 76.68069, 131.53298, 224.701, time[i]));
        cEarth.push(calcularCoordenadasOrbitales(a0Earth, 0.01671123, -0.00001531, 100.46435, 102.93768193, 365.256363004, time[i]));
        cMars.push(calcularCoordenadasOrbitales(a0Mars, 0.09339410, 1.84969, 49.57854, 336.04084, 686.98, time[i]));
        cJupiter.push(calcularCoordenadasOrbitales(a0Jupiter, 0.04838624, 1.30439695, 100.55615, 14.75385, 4332.8201, time[i]));
        cSaturn.push(calcularCoordenadasOrbitales(a0Saturn, 0.05386179, 2.48599187, 113.71504, 92.43194, 10759.22, time[i]));
        cUranus.push(calcularCoordenadasOrbitales(a0Uranus, 0.04725744, 0.77263783, 74.22988, 170.96424, 30685.4, time[i]));
        cNeptune.push(calcularCoordenadasOrbitales(a0Neptune, 0.00859048, 1.77004347, 131.72169, 44.97135, 60189, time[i]));
        cPluto.push(calcularCoordenadasOrbitales(a0Pluto, 0.24882730, 17.14001206, 110.30347, 224.06676, 90560, 90560 / 1000 * i));
    }
    //Initialize the trajectories of each planet and Pluto
    var trajMercury=createTrajectory(cMercury, time, 87.969);
    var trajVenus = createTrajectory(cVenus, time, 224.701);
    var trajEarth = createTrajectory(cEarth, time, 365.256363004);
    var trajMars = createTrajectory(cMars, time, 686.98,2);
    var trajJupiter = createTrajectory(cJupiter, time, 4332.8201,4);
    var trajSaturn = createTrajectory(cSaturn, time, 10759.22, 10)
    var trajUranus = createTrajectory(cUranus, time, 30685.4, 25);
    var trajNeptune = createTrajectory(cNeptune, time, 60189, 50);
    var trajPluto = createTrajectory(cPluto, time, 90560, 50);
    
    //All initial positions are 0 to have a good rotation of the planets
    var tMercury = create([0, 0, 0], "Images/MercuryImage.jpg", 0.38, 'Mercury');
    var tVenus = create([0, 0, 0], "Images/VenusImage.jpg", 0.95, 'Venus');
    var tEarth = create([0, 0, 0], "Images/EarthImage.jpg", 1, 'Earth');
    var tMars = create([0, 0, 0], "Images/MarsImage.jpg", 0.53, 'Mars');
    var tJupiter = create([0, 0, 0], "Images/JupiterImage.jpg", 3, 'Jupiter');
    var tSaturn = create([0, 0, 0], "Images/saturn.x3d", 2, 'Saturn', true);
    var tUranus = create([0, 0, 0], "Images/UranusImage.jpg", 2, 'Uranus');
    var tNeptune = create([0, 0, 0], "Images/NeptuneImage.jpg", 2, 'Neptune');
    var tPluto = create([0, 0, 0], "Images/PlutoImage.jpg", 0.18, 'Pluto');

    var planets = [[tMercury, cMercury], [tVenus, cVenus], [tEarth, cEarth], [tMars, cMars], [tJupiter, cJupiter], [tSaturn, cSaturn], [tUranus, cUranus], [tNeptune, cNeptune], [tPluto, cPluto]];

    var rotaciones = []//Relations between the rotation of Earth in earth days and the rotation of the other planets in earth days
    rotaciones.push(58.65 / 1);//Mercury
    rotaciones.push(243 / 1);//Venus
    rotaciones.push(1);//Earth
    rotaciones.push(1.03 / 1);//Mars
    rotaciones.push(0.41 / 1);//Jupiter
    rotaciones.push(0.45 / 1);//Saturn
    rotaciones.push(0.72 / 1);//Uranus
    rotaciones.push(0.67 / 1);//Neptune
    rotaciones.push(6.39 / 1);//Pluto
    rotaciones.push(25 / 1);//Sun
    var time2 = 50;
    k = 50;
    setInterval(function () { rotatePlanet(tMercury, 0); }, rotaciones[0] * time2 / k);
    setInterval(function () { rotatePlanet(tVenus, 1,true); }, rotaciones[1] * time2 / k);
    setInterval(function () { rotatePlanet(tEarth, 2); }, rotaciones[2] * time2 / k);
    setInterval(function () { rotatePlanet(tMars, 3); }, rotaciones[3] * time2 / k);
    setInterval(function () { rotatePlanet(tJupiter, 4); }, rotaciones[4] * time2 / k);
    setInterval(function () { rotatePlanet(tSaturn, 5); }, rotaciones[5] * time2 / k);
    setInterval(function () { rotatePlanet(tUranus, 6); }, rotaciones[6] * time2 / k);
    setInterval(function () { rotatePlanet(tNeptune, 7); }, rotaciones[7] * time2 / k);
    setInterval(function () { rotatePlanet(tPluto, 8); }, rotaciones[8] * time2 / k);
    setInterval(function () { rotateSun(document.getElementById('Sun')); }, rotaciones[9] * time2 / k);
    // Función para actualizar el valor mostrado y la variable
    const updateSliderValue = () => {
        sliderValue = parseFloat(rangeSlider.value); // Actualiza la variable como decimal
        clearInterval(interval);
        interval = setInterval(function () { updatePosition(planets); }, Math.pow(10, sliderValue));
        sliderValueDisplay.textContent = Math.pow(10, sliderValue).toFixed(3); // Muestra el valor con 5 decimales
    };// Función para actualizar el valor mostrado y la variable

    // Escucha el evento 'input' en el slider
    rangeSlider.addEventListener('input', updateSliderValue);
    updateSliderValue();

    const updateSolarMassValue = () => {
        solarMassValue = parseFloat(solarMassSlider.value); // Actualiza la variable como decimal
        solarMassDisplay.textContent = solarMassValue.toFixed(2); // Muestra el valor con 2 decimales
        var aMercury = nuevoSemiEjeMayorConFactor(a0Mercury, solarMassValue);
        var aVenus = nuevoSemiEjeMayorConFactor(a0Venus, solarMassValue);
        var aEarth = nuevoSemiEjeMayorConFactor(a0Earth, solarMassValue);
        var aMars = nuevoSemiEjeMayorConFactor(a0Mars, solarMassValue);
        var aJupiter = nuevoSemiEjeMayorConFactor(a0Jupiter, solarMassValue);
        var aSaturn = nuevoSemiEjeMayorConFactor(a0Saturn, solarMassValue);
        var aUranus = nuevoSemiEjeMayorConFactor(a0Uranus, solarMassValue);
        var aNeptune = nuevoSemiEjeMayorConFactor(a0Neptune, solarMassValue);
        var aPluto = nuevoSemiEjeMayorConFactor(a0Pluto, solarMassValue);
        for (var i = 0; i < 10000; i++) {
            cMercury[i] = calcularCoordenadasOrbitales(aMercury, 0.20563069, 7.00487, 48.33167, 77.45645, 87.969, time[i]);
            cVenus[i] = calcularCoordenadasOrbitales(aVenus, 0.00677323, 3.39471, 76.68069, 131.53298, 224.701, time[i]);
            cEarth[i] = calcularCoordenadasOrbitales(aEarth, 0.01671123, -0.00001531, 100.46435, 102.93768193, 365.256363004, time[i]);
            cMars[i] = calcularCoordenadasOrbitales(aMars, 0.09339410, 1.84969, 49.57854, 336.04084, 686.98, time[i]);
            cJupiter[i] = calcularCoordenadasOrbitales(aJupiter, 0.04838624, 1.30439695, 100.55615, 14.75385, 4332.8201, time[i]);
            cSaturn[i] = calcularCoordenadasOrbitales(aSaturn, 0.05386179, 2.48599187, 113.71504, 92.43194, 10759.22, time[i]);
            cUranus[i] = calcularCoordenadasOrbitales(aUranus, 0.04725744, 0.77263783, 74.22988, 170.96424, 30685.4, time[i]);
            cNeptune[i] = calcularCoordenadasOrbitales(aNeptune, 0.00859048, 1.77004347, 131.72169, 44.97135, 60189, time[i]);
            cPluto[i] = calcularCoordenadasOrbitales(aPluto, 0.24882730, 17.14001206, 110.30347, 224.06676, 90560, time[i]);
        }
        //Remove the old trajectories}
        removeTrajectory(trajMercury);
        removeTrajectory(trajVenus);
        removeTrajectory(trajEarth);
        removeTrajectory(trajMars);
        removeTrajectory(trajJupiter);
        removeTrajectory(trajSaturn);
        removeTrajectory(trajUranus);
        removeTrajectory(trajNeptune);
        removeTrajectory(trajPluto);
        //Create the new trajectories
        trajMercury = createTrajectory(cMercury, time, 87.969);
        trajVenus = createTrajectory(cVenus, time, 224.701);
        trajEarth = createTrajectory(cEarth, time, 365.256363004);
        trajMars = createTrajectory(cMars, time, 686.98, 2);
        trajJupiter = createTrajectory(cJupiter, time, 4332.8201, 4);
        trajSaturn = createTrajectory(cSaturn, time, 10759.22, 10)
        trajUranus = createTrajectory(cUranus, time, 30685.4, 25);
        trajNeptune = createTrajectory(cNeptune, time, 60189, 50);
        trajPluto = createTrajectory(cPluto, time, 90560, 50);

    }
    solarMassSlider.addEventListener('input', updateSolarMassValue);
    updateSolarMassValue();
}

//Función para calcular el nuevo semieje mayor a' con un factor k
function nuevoSemiEjeMayorConFactor(a, k) {
    //K es el factor de escala M'/M, relación entre la masa nueva de la estrella central y la masa original
    return a * Math.pow(k, 1 / 3);
}


function rotatePlanet(PlanetTransform, x, inverse=false) {
    if (inverse) {
        rots=rotationsinverse;
    } else {
        rots=rotations;
    }
    if (stepRotations[x] === 1000) {
        stepRotations[x] = 0;
    }
    PlanetTransform.setAttribute("rotation", 0 + " " + 1 + " " + 0 + " " + rots[stepRotations[x]]);
    stepRotations[x]++;
}

function rotateSun(sun) {
    if (stepRotations[9] === 1000) {
        stepRotations[9] = 0;
    }
    sun.setAttribute("rotation", "0 1 0 " + rotations[stepRotations[9]]);
    stepRotations[9]++;
}


function updatePosition(planets) {
    if (isUpdating) {
        planets.forEach(function (tPlanet) {
            var coords = tPlanet[1];
            var t = tPlanet[0];
            t.setAttribute("translation", coords[step].x + " " + coords[step].y + " " + coords[step].z);
            if (step === coords.length - 1) {
                step = 0;
            }
        });
        step++;
    }
}

function createTrajectory(coords, time, period, optimization = 1) {
    var orbitCoords = [];
    var indexList = [];
    var previousTime = time[0];
    var segIndex = 0;
    var segmentIDs = []; // Array para almacenar los IDs de los segmentos

    for (let i = 0; i < coords.length; i += optimization) {
        if (previousTime > period) {
            break;
        }

        var s = document.createElement('Shape'); // Shape Node
        var segmentId = "segment" + segIndex; // ID del segmento
        s.setAttribute("id", segmentId);
        segmentIDs.push(segmentId); // Agregar ID a la lista

        var app = document.createElement('Appearance'); // Appearance Node
        var mat = document.createElement('Material'); // Material Node
        mat.setAttribute("id", "Mat" + segIndex);
        mat.setAttribute("diffuseColor", "1 1 0"); // Color amarillo
        mat.setAttribute("emissiveColor", "0.7 1 0.3"); // Color verde
        app.appendChild(mat);
        s.appendChild(app);

        // Obtener las coordenadas
        var segCoords = [coords[i].x, coords[i].y, coords[i].z];
        orbitCoords.push(segCoords.join(" ")); // Almacena las coordenadas como cadena

        // Agregar el índice
        indexList.push(i); // Agregar el índice de la coordenada

        // Solo crea el IndexedLineSet si no es el primer punto
        if (segIndex > 0) {
            var line = document.createElement('IndexedLineSet');
            // Ajustar el coordIndex
            line.setAttribute("coordIndex", (segIndex - 1) + " " + segIndex); // Los índices para la línea actual
            var coordsNode = document.createElement('Coordinate');
            coordsNode.setAttribute("point", orbitCoords.join(", "));
            line.appendChild(coordsNode);
            s.appendChild(line);
        }

        var ot = document.getElementById('Objects');
        ot.appendChild(s);
        previousTime = time[i];
        segIndex++; // Incrementar solo al final del bucle
    }

    return segmentIDs; // Retornar los IDs de los segmentos creados
}

function removeTrajectory(segmentIDs) {
    var ot = document.getElementById('Objects');
    segmentIDs.forEach(function(id) {
        var segment = document.getElementById(id);
        if (segment) {
            ot.removeChild(segment); // Eliminar el segmento del contenedor
        }
    });
}


function calcularCoordenadasOrbitales(a, e, i, Omega, omega, T, t) {
    // Convertir grados a radianes
    const rad = (degrees) => degrees * (Math.PI / 180);

    // Cálculo de la posición en la órbita usando la anomalía media
    const n = (2 * Math.PI) / T; // movimiento angular medio
    const M = n * t; // Anomalía media
    let E = M; // Aproximación inicial para la anomalía excéntrica

    // Método de Newton para encontrar la anomalía excéntrica
    for (let j = 0; j < 10; j++) {
        E = M + e * Math.sin(E);
    }

    // Calcular la posición en el plano orbital
    const x0 = a * (Math.cos(E) - e); // posición en x (orbital)
    const y0 = a * Math.sqrt(1 - e * e) * Math.sin(E); // posición en y (orbital)

    // Rotación a las coordenadas 3D usando Omega, i y omega
    const cosOmega = Math.cos(rad(Omega));
    const sinOmega = Math.sin(rad(Omega));
    const cosi = Math.cos(rad(i));
    const sini = Math.sin(rad(i));
    const cosomega = Math.cos(rad(omega));
    const sinomega = Math.sin(rad(omega));

    // Calcular coordenadas en el plano orbital
    const xOrbital = x0;
    const yOrbital = y0 * cosomega; // Aplicar la rotación por el argumento del periastro
    const zOrbital = y0 * sinomega; // Aplicar la rotación por el argumento del periastro

    // Transformar a coordenadas 3D
    const x = (xOrbital * cosOmega) - (yOrbital * cosi * sinOmega);
    const y = (xOrbital * sinOmega) + (yOrbital * cosi * cosOmega);
    const z = (yOrbital * sini) + (zOrbital * cosi); // Usar zOrbital en la transformación

    return { x: x * 10, y: y * 10, z: z * 10 };
}
let planetInfo = {
    'Mercury': "Mercury has no atmosphere and experiences extreme temperature variations. Its surface is heavily cratered, resembling our Moon. It orbits the Sun every 88 Earth days. Radius: 2,439.7 km.",
    'Earth': "Earth is the only known planet to support life. It has a protective magnetic field and is the largest of the inner terrestrial planets. It orbits the Sun every 225 Earth days. Radius: 6,051.8 km.",
    'Mars': "Mars has the largest volcano in the solar system, Olympus Mons, and a canyon system, Valles Marineris, that dwarfs Earth's Grand Canyon. It orbits the Sun every 365.25 days. Radius: 6,371 km.",
    'Venus': "Venus rotates in the opposite direction of most planets, a phenomenon known as retrograde rotation. Its thick atmosphere creates a runaway greenhouse effect, making it the hottest planet in our solar system. It orbits the Sun every 687 Earth days. Radius: 3,389.5 km.",
    'Jupiter': "Jupiter has a Great Red Spot, a giant storm that has been raging for at least 400 years. It also has a faint ring system and 79 known moons. It orbits the Sun every 11.86 Earth years. Radius: 69,911 km.",
    'Saturn': "Saturn's rings are made mostly of ice particles with a small amount of rocky debris. It has 82 confirmed moons, including Titan, the only moon known to have a dense atmosphere. It orbits the Sun every 29.46 Earth years. Radius: 58,232 km.",
    'Uranus': "Uranus was the first planet discovered using a telescope. Its blue color comes from methane in its atmosphere, which absorbs red light. It orbits the Sun every 84 Earth years. Radius: 25,362 km.",
    'Neptune': "Neptune has the strongest winds in the solar system, reaching speeds of over 1,200 mph. It has a prominent dark spot similar to Jupiter's Great Red Spot. It orbits the Sun every 164.79 Earth years. Radius: 24,622 km.",
    'Pluto': "Pluto was reclassified as a dwarf planet in 2006. It has five known moons, the largest being Charon, which is so large that Pluto and Charon orbit a point between them. It orbits the Sun every 248.09 Earth years. Radius: 1,188.3 km.",
    'Sun': "The Sun accounts for 99.86% of the mass in the solar system. It's about 4.6 billion years old and is expected to remain stable for another 5 billion years before expanding into a red giant.The Sun rotates on its axis every 27 days at its equator. Radius: 696,340 km."
};


function showInfoBox(planetName, event) {
    let info = planetInfo[planetName] || "Cuerpo celeste.";
    isUpdating = false;
    // Obtener el elemento infobox y actualizar su contenido
    var infoBox = document.getElementById('infoBox');
    ViewPlanet(planetName);
    infoBox.innerHTML = info;
    infoBox.style.left = '88%';  // Centrar horizontalmente
    infoBox.style.top = '100px';  // 10 píxeles desde la parte superior
    infoBox.style.transform = 'translateX(-50%)';  // Centrar correctamente
    infoBox.style.display = 'block';

}

function hideInfoBox() {
    document.getElementById('infoBox').style.display = 'none';
}

// Agregar event listeners a los botones
document.querySelectorAll('.card-btn').forEach(button => {
    button.addEventListener('click', function() {
        const viewPoint = document.getElementById('initialView');
        viewPoint.setAttribute('position', '0 0 100');
        viewPoint.setAttribute('orientation', '0 0 0 0');
        viewPoint.setAttribute('fieldOfView', '0.785398'); // Valor para la vista predeterminada
        isUpdating = false;
        navInfo.setAttribute('Type', 'None');
        const planetName = this.getAttribute('data-planet');
        console.log(planetName);
        showInfoBox(planetName);
    });
});


// Agregar event listener al documento para cerrar el infobox
document.addEventListener('click', function(event) {
    var infoBox = document.getElementById('infoBox');
    var isClickInsideInfoBox = infoBox.contains(event.target);
    var isClickOnButton = event.target.classList.contains('card-btn');
    
    if (!isClickInsideInfoBox && !isClickOnButton) {
        hideInfoBox();
        navInfo.setAttribute('Type', 'Examinate');
        const viewPoint = document.getElementById('initialView');
    }
});

function ViewPlanet(planetName) {
    // Obtiene el nodo del Viewpoint que deseas modificar
    const viewPoint = document.getElementById('initialView');

    if (planetName === "Sun") {
        // Si el planeta es el Sol, establece esta vista
        viewPoint.setAttribute('position', '0 0 100');
        viewPoint.setAttribute('orientation', '0 0 0 0');
        viewPoint.setAttribute('fieldOfView', '0.02'); // Valor para la vista del Sol
    } else {
        // Obtiene el nodo del planeta que deseas seguir
        const planetTransform = document.getElementById(planetName + 'Position'); // Usar el ID del transform

        if (planetTransform) {
            // Obtiene la posición del planeta
            const planetPosition = planetTransform.getAttribute('translation').split(' ').map(Number);
            
            // Ajusta el zoom y la orientación del Viewpoint
            const zoomFactor = 5; // Cambia este valor para ajustar el nivel de zoom
            
            // Establece la nueva posición del Viewpoint (con algo de desplazamiento en Z para hacer zoom)
            viewPoint.setAttribute('position', `${planetPosition[0]} ${planetPosition[1]} ${planetPosition[2] + zoomFactor}`);
            
            // También puedes cambiar la orientación para mirar hacia el planeta
            const directionVector = planetPosition.map(coord => -coord); // Invertir la dirección para que mire hacia el planeta
            viewPoint.setAttribute('orientation', `${directionVector[0]} ${directionVector[1]} ${directionVector[2]} 0`); // Ajusta el ángulo si es necesario
        }
    }
}




