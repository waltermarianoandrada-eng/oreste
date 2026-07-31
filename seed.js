const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const INITIAL_ARTWORKS = [
    {
        id: "artwork-federal",
        title: "Forjadores de la Historia",
        year: 2009,
        category: "oleo",
        medium: "Óleo sobre lienzo",
        size: "1.10 m × 0.90 m",
        author: "O. J. Comello (Noviembre, 2009)",
        description: "Esta pintura rinde homenaje a nuestras raíces riojanas. Utilizando como fondo los colores de la bandera de la provincia de La Rioja, el autor dibuja el mapa provincial y dentro de él entrelaza los rostros de los protagonistas de nuestra historia. La obra invita a reflexionar sobre el pasado, mostrando la unión de los pueblos originarios, la época colonial y la impronta de los caudillos federales que forjaron la identidad y la autonomía de nuestra tierra.",
        image: "/obra-federal.png"
    },
    {
        id: "artwork-playa",
        title: "Caminata al Atardecer",
        year: 2026,
        category: "oleo",
        medium: "Óleo sobre lienzo",
        size: "80 x 60 cm",
        author: "O. J. Comello",
        date: "19 de mayo de 2026",
        origin: "Colección privada, La Rioja, Argentina",
        description: "Obra realizada por especial encargo y dedicada a un reconocido empresario del sector de la cafetería de La Rioja (MONACO), una figura profundamente valorada y querida por el artista. La pintura captura un momento de íntima serenidad: una pareja caminando de la mano a la orilla del mar, de espaldas al espectador, avanzando hacia un horizonte custodiado por montañas bajo un cielo de nubes expresivas. Lejos del ritmo urbano y comercial, el cuadro evoca el descanso, el compañerismo y la complicidad del afecto sincero. Una pieza que fusiona el arte con la gratitud y la amistad entrañable que une al pintor con su destinatario.",
        image: "/obra-playa.jpg"
    },
    {
        id: "artwork-soldado",
        title: "Retrato del General",
        year: 2026,
        category: "dibujo",
        medium: "Óleo monocromático sobre lienzo",
        size: "0.90 m × 0.70 m",
        author: "O. J. Comello (Junio, 2026)",
        origin: "Colección particular, La Rioja, Argentina",
        description: "Este retrato ecuestre/militar en busto fue pintado a pedido para un empresario riojano. Con una paleta estrictamente monocroma que emula la estética de la fotografía histórica en blanco y negro, el autor retrata al General Videla portando la gorra de gala con el escudo nacional. La atmósfera difuminada del fondo contrasta con la claridad del texto inferior, una máxima que actúa como declaración de principios del personaje y del contexto representado. La obra fusiona el arte del retrato por encargo con la memoria política e institucional del siglo XX argentino.",
        image: "/obra-soldado.jpg"
    },
    {
        id: "artwork-victoria",
        title: "Victoria Romero",
        year: 2018,
        category: "dibujo",
        medium: "Dibujo monocromático",
        size: "70 x 50 cm",
        author: "O. J. Comello",
        tribute: "Victoria Romero ('La Chacha')",
        origin: "Patrimonio escolar · Barrio Nueva Rioja",
        description: "Este retrato rinde homenaje a una de las máximas heroínas de la historia riojana: Victoria Romero, quien luchó codo a codo junto a su esposo, el General Ángel Vicente \"Chacho\" Peñaloza. La obra utiliza pinceladas enérgicas y un estilo en blanco y negro que evoca el pasado histórico de la provincia, destacando su rostro envuelto en un manto oscuro que resalta la solemnidad del personaje. Al haber sido donado directamente por el pintor O. J. Comello a esta comunidad educativa del barrio Nueva Rioja, el cuadro se convierte en un valioso recurso pedagógico que invita a alumnos y docentes a reflexionar sobre el rol de la mujer en la construcción de nuestra patria chica.",
        image: "/obra-victoria.jpg"
    },
    {
        id: "artwork-pamela",
        title: "Retrato de Dama con Pamela",
        year: 2026,
        category: "oleo",
        medium: "Óleo sobre soporte (texturizado)",
        size: "30 x 20 cm",
        author: "O. J. Comello",
        description: "Este delicado retrato de formato vertical captura la esencia de la elegancia clásica a través de una paleta cromática sutil y una textura táctil muy particular. La obra presenta la silueta de perfil de una mujer noble o de la alta sociedad, ataviada con una imponente pamela (sombrero de ala ancha) decorada con detalles florales en relieve, un elemento característico de la moda de finales del siglo XIX y principios del XX. El artista utiliza una técnica de empaste sutil, donde las pinceladas visibles y el relieve texturizado del fondo aportan volumen, dinamismo y una cualidad casi escultórica a la superficie pictórica.",
        image: "/obra-pamela.png"
    },
    {
        id: "artwork-flores",
        title: "Flores en Florero Azul",
        year: 2026,
        category: "oleo",
        medium: "Óleo sobre lienzo",
        size: "60 x 80 cm",
        author: "O. J. Comello",
        description: "En este bodegón, el autor explora el color y la textura a través de un florero clásico. El protagonismo se divide entre el azul profundo del jarrón, trabajado con visibles trazos de espátula o pincel cargado, y la delicadeza del ramo superior, donde conviven calas blancas y espigas de flores azuladas que buscan la verticalidad. El fondo texturado en tonos cálidos envuelve la escena, dándole una atmósfera acogedora y luminosa, ideal para el entorno de encuentro y tradición que caracteriza a El Topón.",
        image: "/obra-flores.png"
    }
];

async function seedDB() {
  try {
    for (const art of INITIAL_ARTWORKS) {
      const added_at = Date.now();
      await pool.query(`
        INSERT INTO artworks (id, title, year, category, medium, size, author, tribute, date, origin, description, image, added_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO NOTHING
      `, [
        art.id, art.title, art.year, art.category, art.medium, art.size, 
        art.author || null, art.tribute || null, art.date || null, art.origin || null, art.description || null, art.image, added_at
      ]);
    }
    console.log('Seeded database with initial artworks!');
  } catch (err) {
    console.error('Error seeding DB:', err);
  } finally {
    pool.end();
  }
}

seedDB();
