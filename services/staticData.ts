
import { LevelData, PodcastEpisode } from "../types";

export const GOGOLINK_LEVELS: LevelData[] = [
  {
    level: 1,
    timeLimit: 60,
    pairs: [
      { finnish: "Rakastaa", emoji: "❤️" },
      { finnish: "Nukkua", emoji: "😴" },
      { finnish: "Juosta", emoji: "🏃" },
      { finnish: "Sataa", emoji: "🌧️" },
      { finnish: "Voittaa", emoji: "🏆" },
      { finnish: "Musiikki", emoji: "🎵" },
      { finnish: "Kirjoittaa", emoji: "✍️" },
      { finnish: "Ajatella", emoji: "💭" }
    ]
  },
  {
    level: 2,
    timeLimit: 60,
    pairs: [
      { finnish: "Lumi", emoji: "❄️" },
      { finnish: "Tuli", emoji: "🔥" },
      { finnish: "Vuori", emoji: "⛰️" },
      { finnish: "Meri", emoji: "🌊" },
      { finnish: "Puu", emoji: "🌳" },
      { finnish: "Kukka", emoji: "🌸" },
      { finnish: "Tähti", emoji: "⭐" },
      { finnish: "Kuu", emoji: "🌙" }
    ]
  },
  {
    level: 3,
    timeLimit: 70,
    pairs: [
      { finnish: "Matkalaukku", emoji: "🧳" },
      { finnish: "Passi", emoji: "🛂" },
      { finnish: "Paita", emoji: "👕" },
      { finnish: "Kenkä", emoji: "👟" },
      { finnish: "Silmälasit", emoji: "👓" },
      { finnish: "Sateenvarjo", emoji: "☂️" },
      { finnish: "Kamera", emoji: "📷" },
      { finnish: "Kartta", emoji: "🗺️" }
    ]
  },
  {
    level: 4,
    timeLimit: 75,
    pairs: [
      { finnish: "Tietokone", emoji: "💻" },
      { finnish: "Sähköposti", emoji: "📧" },
      { finnish: "Kalenteri", emoji: "📅" },
      { finnish: "Kokous", emoji: "🤝" },
      { finnish: "Idea", emoji: "💡" },
      { finnish: "Paperi", emoji: "📄" },
      { finnish: "Kynä", emoji: "🖊️" },
      { finnish: "Roskakori", emoji: "🗑️" }
    ]
  },
  {
    level: 5,
    timeLimit: 80,
    pairs: [
      { finnish: "Jalkapallo", emoji: "⚽" },
      { finnish: "Maalata", emoji: "🎨" },
      { finnish: "Pyöräillä", emoji: "🚲" },
      { finnish: "Uida", emoji: "🏊" },
      { finnish: "Tanssia", emoji: "💃" },
      { finnish: "Laulaa", emoji: "🎤" },
      { finnish: "Pelata", emoji: "🎮" },
      { finnish: "Lukea", emoji: "📚" }
    ]
  },
  {
    level: 6,
    timeLimit: 90,
    pairs: [
      { finnish: "Illoinen", emoji: "😊" },
      { finnish: "Surullinen", emoji: "😢" },
      { finnish: "Vihainen", emoji: "😠" },
      { finnish: "Pelästynyt", emoji: "😱" },
      { finnish: "Sairas", emoji: "🤒" },
      { finnish: "Vahva", emoji: "💪" },
      { finnish: "Viileä", emoji: "😎" },
      { finnish: "Kummitus", emoji: "👻" }
    ]
  },
  {
    level: 7,
    timeLimit: 90,
    pairs: [
      { finnish: "Kierrätys", emoji: "♻️" },
      { finnish: "Tehdas", emoji: "🏭" },
      { finnish: "Oikeus", emoji: "⚖️" },
      { finnish: "Rauha", emoji: "🕊️" },
      { finnish: "Vaara", emoji: "⚠️" },
      { finnish: "Tiede", emoji: "🧪" },
      { finnish: "Avaruus", emoji: "🌌" },
      { finnish: "Sähkö", emoji: "⚡" }
    ]
  },
  {
    level: 8,
    timeLimit: 100,
    pairs: [
      { finnish: "Aika", emoji: "⏳" },
      { finnish: "Salaisuus", emoji: "🤫" },
      { finnish: "Muisto", emoji: "🧠" },
      { finnish: "Unelma", emoji: "✨" },
      { finnish: "Rakkaus", emoji: "💘" },
      { finnish: "Kuolema", emoji: "⚰️" },
      { finnish: "Syntymä", emoji: "🐣" },
      { finnish: "Voima", emoji: "🔋" }
    ]
  }
];

export const PODCAST_SCRIPTS: PodcastEpisode[] = [
  {
    id: "ep1",
    title: "Sairaalassa (At the Hospital)",
    topic: "Health",
    level: "A2",
    transcript: [
      { speaker: "Lääkäri", text: "Huomenta. Mikä sinua vaivaa tänään?" },
      { speaker: "Potilas", text: "Minulla on kova päänsärky ja kuumetta." },
      { speaker: "Lääkäri", text: "Kuinka kauan oireet ovat kestäneet?" },
      { speaker: "Potilas", text: "Noin kaksi päivää. Otin särkylääkettä, mutta se ei auttanut." },
      { speaker: "Lääkäri", text: "Selvä. Mittaan kuumeesi ja kuuntelen keuhkosi. Hengitä syvään." },
      { speaker: "Potilas", text: "Onko se vakavaa?" },
      { speaker: "Lääkäri", text: "Ei hätää, se on luultavasti vain flunssa. Kirjoitan sinulle reseptin." }
    ]
  },
  {
    id: "ep2",
    title: "Työhaastattelu (Job Interview)",
    topic: "Work",
    level: "B1",
    transcript: [
      { speaker: "Haastattelija", text: "Tervetuloa. Kerro hieman itsestäsi." },
      { speaker: "Hakija", text: "Kiitos. Olen Matti ja olen työskennellyt ohjelmistokehittäjänä viisi vuotta." },
      { speaker: "Haastattelija", text: "Miksi haluat vaihtaa työpaikkaa?" },
      { speaker: "Hakija", text: "Etsin uusia haasteita ja haluan oppia uusia teknologioita." },
      { speaker: "Haastattelija", text: "Mitkä ovat vahvuutesi?" },
      { speaker: "Hakija", text: "Olen nopea oppimaan ja tulen hyvin toimeen ihmisten kanssa." },
      { speaker: "Haastattelija", text: "Kuulostaa hyvältä. Meillä on mukava tiimi täällä." }
    ]
  },
  {
    id: "ep3",
    title: "Hotellissa (At the Hotel)",
    topic: "Travel",
    level: "A2",
    transcript: [
      { speaker: "Virkailija", text: "Tervetuloa Hotel Helsinkiin. Kuinka voin auttaa?" },
      { speaker: "Matkustaja", text: "Hei, minulla on varaus nimellä Virtanen." },
      { speaker: "Virkailija", text: "Hetki pieni... Kyllä, kahden hengen huone kahdeksi yöksi." },
      { speaker: "Matkustaja", text: "Juuri niin. Sisältyykö aamiainen hintaan?" },
      { speaker: "Virkailija", text: "Kyllä, aamiainen tarjoillaan kello seitsemästä kymmeneen." },
      { speaker: "Matkustaja", text: "Hienoa. Missä hissi on?" },
      { speaker: "Virkailija", text: "Hissi on tuolla oikealla. Huoneenne on numero 305." }
    ]
  },
  {
    id: "ep4",
    title: "Ravintolassa (At the Restaurant)",
    topic: "Food",
    level: "A2",
    transcript: [
      { speaker: "Tarjoilija", text: "Haluaisitteko tilata?" },
      { speaker: "Asiakas", text: "Kyllä, kiitos. Ottaisin lohikeittoa alkuruoaksi." },
      { speaker: "Tarjoilija", text: "Entä pääruoka?" },
      { speaker: "Asiakas", text: "Haluaisin poronkäristystä ja perunamuusia." },
      { speaker: "Tarjoilija", text: "Ja mitä saisi olla juotavaksi?" },
      { speaker: "Asiakas", text: "Vettä ja lasi punaviiniä, kiitos." },
      { speaker: "Tarjoilija", text: "Selvä, tuon juomat hetken kuluttua." }
    ]
  }
];