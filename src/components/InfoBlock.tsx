

interface Preset {
    bgImage: string;
    mainText: string;
    ptext: string;
  }
   
  
  const presets: { [key: number]: Preset } = {
    1: {
      bgImage: "/The_Jazz_Singer.jpg",
      mainText: `Фильм "Певец Джаза" (1927)`,
      ptext: "стал первым фильмом с звуком, открыв новую эру в кинематографе.",
    },
    2: {
      bgImage: "/Avatar.jpg",
      mainText: `"Аватар" (2009) - cамый дорогой фильм `,
      ptext: "в истории кинематографа - бюджет которого превысил $300 миллионов.",
    },
    3: {
      bgImage: "/Krestniy_Father.jpg",
      mainText: `Культовый фильм "Крестный отец" (1972) `,
      ptext: " был снят без использования книги, на которой он основан.",
    },
    4: {
      bgImage: "/Matrix.jpg",
      mainText: `В фильме "Матрица" (1999)`,
      ptext: "для сцены, где Нео уклоняется от пуль, использовали технологию БУЛЛЕТТАЙМ, которая позволяла замедлить время и показать действие с разных ракурсов.",
    },
    5: {
      bgImage: "/Pixar.jpg",
      mainText: `Компания Pixar`,
      ptext: `придумывала свои мультфильмы по принципу "А что если...", где создатели задавали себе вопросы о необычных ситуациях или идеях, которые могли стать основой для увлекательного сюжета.`,
    },
    6: {
      bgImage: "/Ratatouille.jpg",
      mainText: `В процессе создания мультфильма "Рататуй" `,
      ptext: "отрудники Pixar провели несколько дней в ресторанах Парижа, чтобы изучить кулинарные процессы и атмосферу для достижения максимальной аутентичности.",
    },
    7: {
      bgImage: "/Survived.jpg",
      mainText: `Актер Леонардо ДиКаприо`,
      ptext: `номинировался на Оскар более 5 раз, прежде чем выиграл свою первую статуэтку за фильм "Выживший" (2015).`,
    },
    8: {
      bgImage: "/Tom_Kruise.jpg",
      mainText: `Актер Том Круз `,
      ptext: `снимался во всех фильмах серии "Миссия невыполнима" и выполнял все свои трюки самостоятельно.`,
    },
    
  }

const randomObject = (() => {
const keys = Object.keys(presets);
const randomIndex = Math.floor(Math.random() * keys.length);
const randomKey = keys[randomIndex];
return presets[Number(randomKey)];
})();


export default function InfoBlock() {


  return (
    <div className="relative w-full h-[500px] bg-cover bg-center rounded-3xl" style={{ backgroundImage: `url(${randomObject.bgImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
                <h1 className="text-4xl font-bold">{randomObject.mainText}</h1>
                <p className="text-xl">{randomObject.ptext}</p>
            </div>
        </div>
        <div className="absolute inset-0 rounded bg-white opacity-5"></div>
        <div className="absolute inset-0 rounded bg-white opacity-5 m-2 filter blur-3xl"></div>
    </div>

  )
}
