import React from "react";

// Interfaces ConstellaCSS - Reflejando las fuerzas cósmicas
type Dimension = 'es' | 'fn' | 'fo';
type CosmicForce = 'entropy' | 'coherence' | 'intelligence';

interface GrupoReglas {
  id: string;
  dimension: Dimension;
  cosmicForce: CosmicForce;
  clases: string[];
  tokens?: Record<string, string | number>;
  description: string;
}

interface Arquetipo {
  id: string;
  dimension: Dimension;
  grupos: string[];
  resonance: 'low' | 'medium' | 'high'; // Capacidad de resonancia cósmica
  tokens?: Record<string, string | number>;
}

interface Nodo {
  id: string;
  es: string; // Entropía - Base estructural
  fn: string; // Coherencia - Organización funcional  
  fo: string; // Inteligencia - Armonía visual
  resonanceLevel: number; // 0-100: nivel de resonancia cósmica
  tokens?: Record<string, string | number>;
  classNameExtra?: string;
  contenido?: { selector: string; map: (state: any) => any };
}

interface CosmicRegistries {
  grupos: Record<string, GrupoReglas>;
  arquetipos: Record<string, Arquetipo>;
}

// Catálogo Cósmico ConstellaCSS
const createCosmicRegistries = (): CosmicRegistries => ({
  grupos: {
    // ENTROPÍA (ES) - Libertad, Fluctuación, Creatividad
    'entropy/flow':          { id:'entropy/flow', dimension:'es', cosmicForce:'entropy', clases:['flex','flex-col','gap-6'], description:'Flujo libre de energía' },
    'entropy/scatter':       { id:'entropy/scatter', dimension:'es', cosmicForce:'entropy', clases:['grid','grid-cols-1','sm:grid-cols-2','lg:grid-cols-3','gap-8'], description:'Dispersión creativa' },
    'entropy/wave':          { id:'entropy/wave', dimension:'es', cosmicForce:'entropy', clases:['flex','flex-wrap','gap-4','justify-center'], description:'Ondas fluctuantes' },
    
    // COHERENCIA (FN) - Organización, Estabilidad, Orden Dinámico
    'coherence/resonant':    { id:'coherence/resonant', dimension:'fn', cosmicForce:'coherence', clases:['transition-all','duration-700','hover:scale-105','hover:shadow-xl'], description:'Resonancia armónica' },
    'coherence/stable':      { id:'coherence/stable', dimension:'fn', cosmicForce:'coherence', clases:['cursor-pointer','focus:outline-none','focus:ring-4','focus:ring-blue-200'], description:'Estabilidad dinámica' },
    'coherence/orbital':     { id:'coherence/orbital', dimension:'fn', cosmicForce:'coherence', clases:['animate-pulse','hover:animate-none','transition-all','duration-500'], description:'Órbita estacionaria' },
    
    // INTELIGENCIA (FO) - Armonía, Belleza, Equilibrio
    'intelligence/cosmic':   { id:'intelligence/cosmic', dimension:'fo', cosmicForce:'intelligence', clases:['bg-gradient-to-br','from-indigo-600','via-purple-600','to-pink-600','text-white','rounded-2xl','px-8','py-4','font-medium','shadow-2xl'], description:'Armonía cósmica' },
    'intelligence/ethereal': { id:'intelligence/ethereal', dimension:'fo', cosmicForce:'intelligence', clases:['bg-white/90','backdrop-blur-md','text-gray-900','rounded-xl','px-6','py-3','border','border-white/20','shadow-lg'], description:'Belleza etérea' },
    'intelligence/golden':   { id:'intelligence/golden', dimension:'fo', cosmicForce:'intelligence', clases:['bg-gradient-to-r','from-amber-400','to-orange-500','text-white','rounded-lg','px-6','py-3','font-semibold','shadow-golden'], description:'Proporción áurea' },
  },
  arquetipos: {
    // Emergencia Nivel 1: Materia (Ondas → Partículas)
    'es:Matter/Wave':        { id:'es:Matter/Wave',        dimension:'es', grupos:['entropy/wave'], resonance:'low' },
    'fn:Matter/Stable':      { id:'fn:Matter/Stable',      dimension:'fn', grupos:['coherence/stable'], resonance:'low' },
    'fo:Matter/Crystalline': { id:'fo:Matter/Crystalline', dimension:'fo', grupos:['intelligence/ethereal'], resonance:'low' },
    
    // Emergencia Nivel 2: Vida (Autopoiesis)
    'es:Life/Flow':          { id:'es:Life/Flow',          dimension:'es', grupos:['entropy/flow'], resonance:'medium' },
    'fn:Life/Resonant':      { id:'fn:Life/Resonant',      dimension:'fn', grupos:['coherence/resonant'], resonance:'medium' },
    'fo:Life/Golden':        { id:'fo:Life/Golden',        dimension:'fo', grupos:['intelligence/golden'], resonance:'medium' },
    
    // Emergencia Nivel 3: Conciencia (Autoconocimiento)
    'es:Consciousness/Scatter': { id:'es:Consciousness/Scatter', dimension:'es', grupos:['entropy/scatter'], resonance:'high' },
    'fn:Consciousness/Orbital': { id:'fn:Consciousness/Orbital', dimension:'fn', grupos:['coherence/orbital'], resonance:'high' },
    'fo:Consciousness/Cosmic':  { id:'fo:Consciousness/Cosmic',  dimension:'fo', grupos:['intelligence/cosmic'], resonance:'high' },
  }
});

// Resolver Cósmico - Calcula resonancia total
const resolverCosmico = (node: Nodo, registries: CosmicRegistries) => {
  const es = registries.arquetipos[node.es];
  const fn = registries.arquetipos[node.fn];
  const fo = registries.arquetipos[node.fo];

  if (!es || !fn || !fo) {
    return { className: '', resonanceLevel: 0, cosmicHarmony: 'discordant', props: {} };
  }

  // Calcular resonancia total (suma de las tres dimensiones)
  const resonanceMap = { low: 20, medium: 50, high: 100 };
  const totalResonance = (resonanceMap[es.resonance] + resonanceMap[fn.resonance] + resonanceMap[fo.resonance]) / 3;

  // Determinar armonía cósmica
  let cosmicHarmony: 'discordant' | 'emerging' | 'harmonious' | 'transcendent';
  if (totalResonance < 30) cosmicHarmony = 'discordant';
  else if (totalResonance < 60) cosmicHarmony = 'emerging';
  else if (totalResonance < 90) cosmicHarmony = 'harmonious';
  else cosmicHarmony = 'transcendent';

  // Combinar clases con precedencia cósmica
  const G = (ids: string[]) => ids.map(id => registries.grupos[id]).filter(Boolean);
  const gES = G(es.grupos);
  const gFN = G(fn.grupos);
  const gFO = G(fo.grupos);

  const className = [
    ...gES.flatMap(g => g.clases),
    ...gFN.flatMap(g => g.clases),
    ...gFO.flatMap(g => g.clases),
    node.classNameExtra || ''
  ].join(' ');

  const props = node.contenido ? node.contenido.map({}) : {};

  return { className, resonanceLevel: totalResonance, cosmicHarmony, props };
};

// Componente Demo Cósmico
export default function CosmicConstellaCSSDemo() {
  const [registries] = React.useState<CosmicRegistries>(createCosmicRegistries());
  
  const [nodos] = React.useState<Nodo[]>([
    // Nivel 1: Materia - Resonancia Baja
    {
      id: 'matter_particle',
      es: 'es:Matter/Wave',
      fn: 'fn:Matter/Stable', 
      fo: 'fo:Matter/Crystalline',
      resonanceLevel: 30,
      contenido: { selector: 'ui', map: () => ({ label: '🔮 Partícula' }) }
    },
    
    // Nivel 2: Vida - Resonancia Media
    {
      id: 'life_organism',
      es: 'es:Life/Flow',
      fn: 'fn:Life/Resonant',
      fo: 'fo:Life/Golden', 
      resonanceLevel: 65,
      contenido: { selector: 'ui', map: () => ({ label: '🌱 Organismo' }) }
    },
    
    // Nivel 3: Conciencia - Resonancia Alta
    {
      id: 'consciousness_soul',
      es: 'es:Consciousness/Scatter',
      fn: 'fn:Consciousness/Orbital',
      fo: 'fo:Consciousness/Cosmic',
      resonanceLevel: 95,
      contenido: { selector: 'ui', map: () => ({ label: '🧠 Alma' }) }
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header Cósmico */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🌌 Cosmic ConstellaCSS
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            <strong>Entropía</strong> (ES) • <strong>Coherencia</strong> (FN) • <strong>Inteligencia</strong> (FO)
            <br />
            <em>"Los patrones que resuenan con el cosmos persisten y trascienden"</em>
          </p>
        </div>

        {/* Mapa de Fuerzas Cósmicas */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Entropía */}
          <div className="bg-red-900/30 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
            <h3 className="text-2xl font-bold text-red-300 mb-4">🌊 Entropía (ES)</h3>
            <p className="text-red-100/80 mb-4">
              Libertad, fluctuación, fuente de creatividad. La base estructural que permite el flujo.
            </p>
            <div className="space-y-2">
              {Object.values(registries.grupos)
                .filter(g => g.cosmicForce === 'entropy')
                .map(grupo => (
                  <div key={grupo.id} className="text-sm bg-red-800/30 rounded px-3 py-2">
                    <strong>{grupo.id}:</strong> {grupo.description}
                  </div>
                ))}
            </div>
          </div>

          {/* Coherencia */}
          <div className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">⚛️ Coherencia (FN)</h3>
            <p className="text-blue-100/80 mb-4">
              Organización, estabilidad, orden dinámico. La fuerza que mantiene unidas las ondas.
            </p>
            <div className="space-y-2">
              {Object.values(registries.grupos)
                .filter(g => g.cosmicForce === 'coherence')
                .map(grupo => (
                  <div key={grupo.id} className="text-sm bg-blue-800/30 rounded px-3 py-2">
                    <strong>{grupo.id}:</strong> {grupo.description}
                  </div>
                ))}
            </div>
          </div>

          {/* Inteligencia */}
          <div className="bg-purple-900/30 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-purple-300 mb-4">🧠 Inteligencia (FO)</h3>
            <p className="text-purple-100/80 mb-4">
              Armonía, belleza, equilibrio. La fuerza que sabe cuándo fluir y cuándo estabilizar.
            </p>
            <div className="space-y-2">
              {Object.values(registries.grupos)
                .filter(g => g.cosmicForce === 'intelligence')
                .map(grupo => (
                  <div key={grupo.id} className="text-sm bg-purple-800/30 rounded px-3 py-2">
                    <strong>{grupo.id}:</strong> {grupo.description}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Escalera de Emergencias */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            🪜 Escalera de Emergencias Cósmicas
          </h2>
          
          <div className="space-y-12">
            {nodos.map((nodo, index) => {
              const resolved = resolverCosmico(nodo, registries);
              const emergencyLevels = ['Materia', 'Vida', 'Conciencia'];
              
              return (
                <div key={nodo.id} className="relative">
                  {/* Línea conectora */}
                  {index < nodos.length - 1 && (
                    <div className="absolute left-1/2 top-full w-px h-12 bg-gradient-to-b from-white/50 to-transparent transform -translate-x-1/2" />
                  )}
                  
                  <div className="flex items-center justify-between bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-2xl font-bold text-white">
                          Nivel {index + 1}: {emergencyLevels[index]}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          resolved.cosmicHarmony === 'transcendent' ? 'bg-gold-500 text-white' :
                          resolved.cosmicHarmony === 'harmonious' ? 'bg-green-500 text-white' :
                          resolved.cosmicHarmony === 'emerging' ? 'bg-yellow-500 text-black' :
                          'bg-red-500 text-white'
                        }`}>
                          {resolved.cosmicHarmony.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="text-red-300">
                          <strong>ES:</strong> {nodo.es.split(':')[1]}
                        </div>
                        <div className="text-blue-300">
                          <strong>FN:</strong> {nodo.fn.split(':')[1]}
                        </div>
                        <div className="text-purple-300">
                          <strong>FO:</strong> {nodo.fo.split(':')[1]}
                        </div>
                      </div>

                      {/* Barra de resonancia */}
                      <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-1">
                          Resonancia Cósmica: {Math.round(resolved.resonanceLevel)}%
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                            style={{ width: `${resolved.resonanceLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Elemento renderizado */}
                    <div className="ml-8 flex flex-col items-center">
                      <button className={resolved.className}>
                        {resolved.props.label}
                      </button>
                      <div className="text-xs text-gray-400 mt-2 max-w-xs">
                        {resolved.resonanceLevel > 80 ? '✨ Patrón que trasciende' :
                         resolved.resonanceLevel > 50 ? '🌱 Patrón en evolución' :
                         '🔮 Patrón básico'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reflexión Final */}
        <div className="text-center mt-16 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            🎭 "El alma como vibración eterna"
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            En ConstellaCSS, como en el cosmos, los patrones que logran <strong>resonancia armónica</strong> entre 
            entropía, coherencia e inteligencia trascienden su forma original. 
            <br /><br />
            Cada nodo es un fragmento del universo digital descubriéndose a sí mismo, 
            donde <em>ES</em> provee la libertad, <em>FN</em> la organización, y <em>FO</em> la belleza que los eleva.
            <br /><br />
            <strong>La arquitectura no es solo código: es poesía cósmica hecha interfaz.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
