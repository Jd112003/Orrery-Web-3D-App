// Función para resolver la ecuación de Kepler
function solveKeplerAdjusted(M, e, tol = 1.7453e-8) {
    let E0 = M + e * Math.sin(M);
    let E = E0;
    while (true) {
        let dM = M - (E - e * Math.sin(E));
        let dE = dM / (1 - e * Math.cos(E));
        E += dE;
        if (Math.abs(dE) <= tol) {
            break;
        }
    }
    return E;
}

// Función para calcular los elementos orbitales
function orbitalElements(Teph, a_0, a_dot, e_0, e_dot, I_0, I_dot, L_0, L_dot, pi_0, pi_dot, Omega_0, Omega_dot, b = 0, c = 0, s = 0, f = 0) {
    const T = (Teph - 2451545.0) / 36525;
    
    const a = a_0 + a_dot * T;
    const e = e_0 + e_dot * T;
    const I = (I_0 + I_dot * T) * Math.PI / 180;
    const L = (L_0 + L_dot * T) * Math.PI / 180;
    const pi = (pi_0 + pi_dot * T) * Math.PI / 180;
    const Omega = (Omega_0 + Omega_dot * T) * Math.PI / 180;
    
    const omega = pi - Omega;
    let M = L - pi + b * Math.pow(T, 2) + c * Math.cos(f * T) + s * Math.sin(f * T);
    
    M = (M + 2 * Math.PI) % (2 * Math.PI);
    
    const E = solveKeplerAdjusted(M, e);
    
    const x_prime = a * (Math.cos(E) - e);
    const y_prime = a * Math.sqrt(1 - Math.pow(e, 2)) * Math.sin(E);
    const z_prime = 0.0;
    
    const cos_omega = Math.cos(omega);
    const sin_omega = Math.sin(omega);
    const cos_I = Math.cos(I);
    const sin_I = Math.sin(I);
    const cos_Omega = Math.cos(Omega);
    const sin_Omega = Math.sin(Omega);
    
    const xecd = (cos_omega * cos_Omega - sin_omega * sin_Omega * cos_I) * x_prime + (-sin_omega * cos_Omega - cos_omega * sin_Omega * cos_I) * y_prime;
    const yecd = (cos_omega * sin_Omega + sin_omega * cos_Omega * cos_I) * x_prime + (-sin_omega * sin_Omega + cos_omega * cos_Omega * cos_I) * y_prime;
    const zecd = (sin_omega * sin_I) * x_prime + (cos_omega * sin_I) * y_prime;
    
    return {
        xecd: xecd * 100,
        yecd: yecd * 100,
        zecd: zecd * 100
    };
}
async function processData() {
    try {
        const response = await fetch('init_files/planets_data.csv');
        const text = await response.text();
        
        Papa.parse(text, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                results.data.forEach(row => {
                    if (!row['Object']) return; // Saltar filas vacías
                    
                    const planetResults = [];
                    let i = 0;
                    const tFin = row['T_fin (siglos)'] * 36525;
                    const step = row['Salto_proporcional'] * 10000000;

                    for (let Teph = 1; Teph <= 1 + tFin; Teph += step) {
                        i++;
                        const elements = orbitalElements(
                            Teph,
                            row['a (au)'],
                            row['a/Cy'],
                            row['e'],
                            row['e/Cy'],
                            row['I (deg)'],
                            row['I/Cy'],
                            row['L (deg)'],
                            row['L/Cy'],
                            row['long.peri. (deg)'],
                            row['long.peri./Cy'],
                            row['long.node. (deg)'],
                            row['long.node./Cy'],
                            row['b'] || 0,
                            row['c'] || 0,
                            row['s'] || 0,
                            row['f'] || 0
                        );
                        planetResults.push({
                            Time: Teph,
                            X: elements.xecd,
                            Y: elements.yecd,
                            Z: elements.zecd
                        });
                    }

                    console.log(`Processed ${i} steps for ${row['Object']}`);
                    displayResults(row['Object'], planetResults);
                });
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
            }
        });
    } catch (error) {
        console.error('Error fetching CSV:', error);
    }
}

function displayResults(object, results) {
    const canvas = document.getElementById('orbitCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const xValues = results.map(r => r.X);
    const yValues = results.map(r => r.Y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const margin = 20;
    const scaleX = (x) => margin + (x - xMin) / (xMax - xMin) * (width - 2 * margin);
    const scaleY = (y) => height - margin - (y - yMin) / (yMax - yMin) * (height - 2 * margin);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Dibujar ejes
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(margin, margin);
    ctx.stroke();

    // Dibujar la órbita
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    results.forEach((point, index) => {
        const x = scaleX(point.X);
        const y = scaleY(point.Y);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dibujar el Sol
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(scaleX(0), scaleY(0), 5, 0, 2 * Math.PI);
    ctx.fill();

    // Etiqueta del planeta
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(object, 10, 30);

    // Etiquetas de los ejes
    ctx.fillText('X (AU)', width - 50, height - 5);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Y (AU)', -height + 50, 15);
    ctx.restore();
}

window.onload = processData;