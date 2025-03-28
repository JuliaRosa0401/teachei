// Captura a referência aos elementos de resultado
const resultado = document.getElementById('resultado')
const resultado2 = document.querySelector('#resultado2')

//criar as variaveis de lat e long
let latitude = 0;
let longitude = 0;

const mapa = L.map('mapa').setView([-23.9828992, -48.8669184],10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);

// Função que pega a localização
function pegarLocalizacao(){
    // Verifica se o navegador suporta o recurso de geolocalização
    if(navigator.geolocation){
        // Se suportar, tenta obter a posição atual do usuário
        // O método getCurrentPosition recebe duas funções:
        // - A primeira (mostrarPosicao) é chamada se a localização for obtida com sucesso
        // - A segunda (mostrarErro) é chamada se a localização der erro
        // - A terceira (opcional) permite personalizações

        navigator.geolocation.getCurrentPosition(mostrarPosicao, mostrarErro,{
            enableHighAccuracy: true, // Pede mais precisão
            timeout: 10000, //Espera até 10 segundos para obter a localização
            maximumAge: 0 // Garante que a posição não seja uma antiga, salva no cache
        })


    }else{
        resultado.innerText = 'Geolocalização não é suportada por este navegador'
    }
}

function mostrarErro(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            resultado.innerText = '🚫 O usuário negou o acesso a localização.';
            break;
        case error.POSITION_UNAVAILABLE:
            resultado.innerText = '❌ A localização não está disponível.';
            break;
        case error.TIMEOUT:
            resultado.innerText = '⏳ A solicitação expirou.';
            break;
        default:
            resultado.innerText = '⚠ Erro desconhecido.';
    }
}
function mostrarPosicao(posicao){
    console.log(posicao)
    latitude = posicao.coords.latitude;
    console.log(latitude);
    longitude = posicao.coords.longitude;
    console.log(longitude)
    resultado.innerHTML = `
    Latitude: ${latitude}<br>
    Longitude: ${longitude}<br>
     <a href="https://www.google.com.br/maps/@${latitude},${longitude},20z?entry=ttu" target='_blank'><h4> Ver no Google Maps</h4></a>


    `

    atualizaMapa(latitude,longitude)
    // bucarClima(latitude,longitude);
}

async function  buscarEndereco() {
    if (latitude == null || longitude === null){
        resultado2.innerHTML = "⚠ Primeiro obtenha as coordenadas!";
        return;
    }

    try{
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-br`;

        const resposta = await fetch(url)

        const dados = await resposta.json();
        console.log(dados);

        const endereco = dados.address;
        console.log(endereco)

        resultado2.innerHTML = `
        <h3>📍 Detalhes do endereço:</h3>
        País: ${endereco.country || "N/A"}<br>
        Estado: ${endereco.state || "N/A"}<br>
        Cidade: ${endereco.city || endereco.town || endereco.village || "N/A"}<br>
        Bairro: ${endereco.suburb || "N/A"}<br>
        Rua: ${endereco.road || "N/A"}<br>
        CEP: ${endereco.postcode || "N/A"}<br>
        <a href="https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}" target="_blank">
            <h4>🌍 Ver no OpenStreetMap</h4>
        </a>
    `;
    
    }
    catch (erro) {
        resultado2.innerHTML = "❌ Erro ao buscar o endereço!";
        console.error("Erro ao buscar dados:", erro);
    };
    
}

function atualizaMapa(latitude,longitude){
    mapa.setView([latitude,longitude],19)
    L.marker([latitude,longitude])
        .addTo(mapa)
        .bindPopup("📍 Você está aqui")
        .openPopup ()
}

// async function buscarClima(lat, lon) {
//     try {
//         // Faz a requisição para a API Open-Meteo
//         const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
//         const resposta = await fetch(url);
//         const dados = await resposta.json();
//         console.log(dados);

//         // Exibe os dados do clima
//         const clima = dados.current_weather;
//         const temperatura = clima.temperature;
//         const velocidadeVento = clima.windspeed;

//         // Exibe os dados no HTML
//         resultado.innerHTML += `
//         <h3>🌤️ Clima atual:</h3>
//         Temperatura: ${temperatura}°C<br>
//         Velocidade do Vento: ${velocidadeVento} km/h<br>
//         `;
//     } catch (erro) {
//         resultado.innerHTML += "❌ Erro ao buscar dados climáticos!";
//         console.error("Erro ao buscar clima:", erro);
//     }
// }