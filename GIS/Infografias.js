let LeyendaActiva;
const putLeyenda = {
    "LayerAAPuntos": [
        { label: 'B.Occ Alfonso Cano SM', color: '#51DEEF', opacity: '1' },
        { label: 'Clan del Golfo', color: '#2ECC71', opacity: '1' },
        { label: 'C.Movil Dagoberto Ramos CCO', color: '#0AFA56', opacity: '1' },
        { label: 'Columna Movil Jaime Martinez', color: '#CAF3F8', opacity: '1' },
        { label: 'Comandos de la Frontera', color: '#EEF116', opacity: '1' },
        { label: 'Conq de la sierra nevada', color: '#935116', opacity: '1' },
        { label: 'ELN', color: '#E74C3C', opacity: '1' },
        { label: 'Espartanos', color: '#5499C7', opacity: '1' },
        { label: 'E.M.C de las FARC (F 1ro)', color: '#B60724', opacity: '1' },
        { label: 'Frente 33 GD', color: '#3072E6', opacity: '1' },
        { label: 'Frente 36', color: '#F1F075', opacity: '1' },
        { label: 'Frente Carlos Patiño', color: '#A0929F', opacity: '1' },
        { label: 'Frente Ivan Rios', color: '#F749D0', opacity: '1' },
        { label: 'La oficina', color: '#B68AC3', opacity: '1' },
        { label: 'Los Pachelly', color: '#B6D3BE', opacity: '1' },
        { label: 'Los Shottas', color: '#7F8C8D', opacity: '1' },
        { label: 'Rastrojos', color: '#AB8705', opacity: '1' },
        { label: 'Segunda Marquetalia', color: '#A05FDB', opacity: '1'},
        { label: '<i class="text-secondary"> "E.M.C" Estado Mayor Central</i>', color: 'white', opacity: '1', title: 'Actores Armados 2022'},

    ],
    "LayerDensidadCoca": [
        {
            label: '26222,72 - 59746,49', color: 'green', opacity: '1'
        },
        {
            label: '14222,29', color: 'green', opacity: '0.6'
        },
        {
            label: '10368,03', color: 'green', opacity: '0.4'
        },
        {
            label: '4934,71 - 6363,79', color: 'green', opacity: '0.2'
        },
        {
            label: '2638,92', color: 'green', opacity: '0.1'
        },
        {
            label: '3 - 1833,62', color: 'green', opacity: '0.08', title: 'Densidad de coca'
        },
    ],
    "LayerMacroT": [
        { label: 'Bajo Caqueta, Mirití', color: '#D68910', opacity: '1' },
        { label: 'Paraná, Apaporis > Brasil', color: 'white', opacity: '1' },
        { label: 'C.Central, Cañ Hermosas', color: '#1BF9E1', opacity: '1' },
        { label: 'C.Occidental y S Baudó > Pacífico', color: 'yellow', opacity: '1' },
        { label: 'Catatumbo', color: '#566573', opacity: '1' },
        { label: 'Costa pacífica Chocoana > Pacífico ', color: 'red', opacity: '1' },
        { label: 'S.N Santa Marta, S. Perija', color: '#FADBD8', opacity: '1' },
        { label: 'Guajira > Mar Caribe', color: 'white', opacity: '1' },
        { label: 'N. Paramillo, > golfo de Uraba', color: '#8E44AD', opacity: '1' },
        { label: 'Norte del Cauca > el Pacífico', color: '#F97DAC', opacity: '1' },
        { label: 'Parque Nacional del Cocuy', color: '#50F51F', opacity: '1' },
        { label: 'Reg Antillanura > Venezuela', color: '#FCF3CF', opacity: '1' },
        { label: 'Rio Guaviare > Venezuela', color: '#16A085', opacity: '1' },
        { label: 'Rio Vaupes > Brasil', color: '#E5E7E9', opacity: '1' },
        { label: 'S. del Darien > Centro América', color: '#85C1E9', opacity: '1' },
        { label: 'S. San Jacinto, > Caribe', color: '#196F3D', opacity: '1' },
        { label: 'Sur Cauca, N. Nariño > Pacífico', color: '#ABEBC6', opacity: '1' },
        { label: 'Sur Colombia > Perú, Brasil', color: '#FB0396', opacity: '1' },
        { label: 'Sur de Nariño > Ecuador', color: '#7B241C', opacity: '1' },
        { label: '<i class="text-secondary"> ">" conexión o ruta</i>', color: 'white', opacity: '1', title: 'Macro Territorios (CV)' },
    ],
    "LayerBloquePretrolero": [
        { label: 'Área en exploracion', color: '#F4D03F', opacity: '1' },
        { label: 'Área en produccion', color: '#8E44AD', opacity: '1' },
        { label: 'Área reservada', color: '#5D6D7E', opacity: '1' },
        { label: 'Evaluacion tecnica', color: '#45B39D', opacity: '1' },
        { label: 'Tramite ampliacion', color: '#C0392B', opacity: '1' },
        { label: 'Área reservada ambiental', color: '#E8DAEF', opacity: '1' },
        { label: 'Basamento cristalino', color: '#D6EAF8', opacity: '1' },
        { label: 'Área disponible', color: '#85929E', opacity: '1' },
        { label: 'C.Especial proyecto  investigacion', color: '#2874A6', opacity: '1', title: 'ANH'},
    ],
    "LayerIRV": [
        { label: 'ALTO', color: 'orange', opacity: '1' },
        { label: 'MEDIO ALTO', color: 'orange', opacity: '0.8' },
        { label: 'MEDIO', color: 'orange', opacity: '0.6' },
        { label: 'MEDIO BAJO', color: 'orange', opacity: '0.4' },
        { label: 'BAJO', color: 'orange', opacity: '0.2', title: 'Índice victimización UV' },
    ],
    "LayerPIR": [
        { label: 'ALISTAMIENTO', color: 'gray', opacity: '1' },
        { label: 'CARAC DEL DAÑO', color: 'purple', opacity: '1' },
        { label: 'DISEÑO Y FORMULACIÓN', color: 'orange', opacity: '1' },
        { label: 'IDENTIFICACIÓN', color: 'magenta', opacity: '1' },
        { label: 'IMPLEMENTACIÓN', color: 'blue', opacity: '1' },
        { label: 'IMPLEMENTADO', color: 'green', opacity: '1',title: 'Estados PIR Etnico' },
    ]

}






