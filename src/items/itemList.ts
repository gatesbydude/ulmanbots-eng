import Item from '../interfaces/Item';
import virve from './usableItems/virve';
import divainais_burkans from './usableItems/divainais_burkans';
import mugursoma from './usableItems/mugursoma';
import latloto from './usableItems/latloto';
import dizloto from './usableItems/dizloto';
import kafija from './usableItems/kafija';
import kafijas_aparats from './usableItems/kafijas_aparats';
import velo from './usableItems/velo';
import divaina_mugursoma from './usableItems/divaina_mugursoma';
import petnieks from './usableItems/petnieks';
import juridiska_zivs from './usableItems/juridiska_zivs';
import maksekeresData from '../commands/economyCommands/zvejot/makskeresData';
import makskere, { makskereCustomValue } from './usableItems/makskere';

export type ItemKey = string;

export enum ItemCategory {
  ATKRITUMI,
  VEIKALS,
  ZIVIS,
  MAKSKERE,
  BRIVGRIEZIENS,
  TIRGUS,
  OTHER,
}

const itemList: Record<ItemKey, Item> = {
  // -- veikals --
  koka_makskere: {
    nameNomVsk: 'koka makšķere',
    nameNomDsk: 'koka makšķeres',
    nameAkuVsk: 'koka makšķeri',
    nameAkuDsk: 'koka makšķeres',
    isVirsiesuDzimte: false,
    emoji: {
      id: '1009557004651601931',
      name: 'kokamakskere',
    },
    categories: [ItemCategory.VEIKALS, ItemCategory.MAKSKERE],
    value: 100,
    customValue: makskereCustomValue('koka_makskere'),
    attributes: {
      durability: maksekeresData.koka_makskere.maxDurability,
    },
    allowDiscount: true,
    use: makskere,
  },
  latloto: {
    nameNomVsk: 'latloto biļete',
    nameNomDsk: 'latloto biļetes',
    nameAkuVsk: 'latloto biļeti',
    nameAkuDsk: 'latloto biļetes',
    isVirsiesuDzimte: true,
    emoji: {
      id: '1009557006098645062',
      name: 'latloto',
    },
    categories: [ItemCategory.VEIKALS],
    value: 50,
    removedOnUse: true,
    use: latloto,
  },
  nazis: {
    nameNomVsk: 'nazis',
    nameNomDsk: 'naži',
    nameAkuVsk: 'nazi',
    nameAkuDsk: 'nažus',
    isVirsiesuDzimte: true,
    emoji: {
      id: '1009557010305531944',
      name: 'nazis',
    },
    categories: [ItemCategory.VEIKALS],
    value: 125,
    removedOnUse: true,
    allowDiscount: true,
    // use() {},
  },
  virve: {
    nameNomVsk: 'virve',
    nameNomDsk: 'virves',
    nameAkuVsk: 'virvi',
    nameAkuDsk: 'virves',
    isVirsiesuDzimte: false,
    emoji: {
      id: '1009557012855652453',
      name: 'virve',
    },
    categories: [ItemCategory.VEIKALS],
    value: 10,
    allowDiscount: true,
    removedOnUse: true,
    use: virve,
  },
  zemenu_rasens: {
    nameNomVsk: 'zemeņu Rasēns',
    nameNomDsk: 'zemeņu Rasēni',
    nameAkuVsk: 'zemeņu Rasēnu',
    nameAkuDsk: 'zemeņu Rasēnus',
    isVirsiesuDzimte: true,
    emoji: {
      id: '1009557014143324190',
      name: 'zemenu_rasens',
    },
    categories: [ItemCategory.VEIKALS],
    value: 75,
    allowDiscount: true,
    removedOnUse: true,
    // use() {},
  },
  divainais_burkans: {
    nameNomVsk: 'dīvainais burkāns',
    nameNomDsk: 'dīvainie burkāni',
    nameAkuVsk: 'dīvaino burkānu',
    nameAkuDsk: 'dīvainos burkānus',
    isVirsiesuDzimte: true,
    emoji: {
      id: '1011108345312186439',
      name: 'divainais_burkans',
      animated: true,
    },
    categories: [ItemCategory.VEIKALS],
    value: 5000,
    customValue: ({ customName }) => {
      // humors
      if (customName!.toLowerCase().includes('seks')) return 6969;

      // pārbauda kirilicu
      if (/[а-яА-ЯЁё]/.test(customName!)) return 0;

      return 5000;
    },
    attributes: {
      timesUsed: 0,
      customName: '',
    },
    allowDiscount: true,
    use: divainais_burkans,
  },
  dizloto: {
    nameNomVsk: 'dižloto biļete',
    nameNomDsk: 'dižloto biļetes',
    nameAkuVsk: 'dižloto biļeti',
    nameAkuDsk: 'dižloto biļetes',
    isVirsiesuDzimte: false,
    emoji: {
      id: '1009556999840747570',
      name: 'dizloto',
    },
    categories: [ItemCategory.VEIKALS],
    value: 250,
    removedOnUse: true,
    use: dizloto,
  },
  divaina_makskere: {
    nameNomVsk: 'dīvainā makšķere',
    nameNomDsk: 'dīvainās makšķeres',
    nameAkuVsk: 'dīvaino makšķeri',
    nameAkuDsk: 'dīvainās makšķeres',
    isVirsiesuDzimte: false,
    emoji: null,
    categories: [ItemCategory.VEIKALS, ItemCategory.MAKSKERE],
    value: 500,
    customValue: makskereCustomValue('divaina_makskere'),
    attributes: {
      durability: maksekeresData.divaina_makskere.maxDurability,
    },
    allowDiscount: true,
    use: makskere,
  },
  mugursoma: {
    nameNomVsk: 'mugursoma',
    nameNomDsk: 'mugursomas',
    nameAkuVsk: 'mugursomu',
    nameAkuDsk: 'mugursomas',
    isVirsiesuDzimte: false,
    emoji: {
      id: '1009557008850092059',
      name: 'mugursoma',
    },
    categories: [ItemCategory.VEIKALS],
    value: 500,
    allowDiscount: true,
    removedOnUse: false,
    use: mugursoma,
  },

  // -- tirgus --
  divaina_mugursoma: {
    nameNomVsk: 'dīvainā mugursoma',
    nameNomDsk: 'dīvainās mugursomas',
    nameAkuVsk: 'dīvaino mugursomu',
    nameAkuDsk: 'dīvainās mugursomas',
    isVirsiesuDzimte: false,
    emoji: null,
    categories: [ItemCategory.TIRGUS],
    value: 2000,
    allowDiscount: true,
    removedOnUse: false,
    use: divaina_mugursoma,
  },
  kafijas_aparats: {
    nameNomVsk: 'kafijas aparāts',
    nameNomDsk: 'kafijas aparāti',
    nameAkuVsk: 'kafijas aparātu',
    nameAkuDsk: 'kafijas aparātus',
    isVirsiesuDzimte: true,
    emoji: {
      id: '1011300411191341139',
      name: 'kafijas_aparats',
    },
    categories: [ItemCategory.TIRGUS, ItemCategory.VEIKALS], // TODO: noņemt no veikala
    value: 100,
    attributes: {
      lastUsed: 0,
    },
    removedOnUse: false,
    use: kafijas_aparats,
  },
  petnieks: {
    nameNomVsk: 'pētnieks',
    nameNomDsk: 'pētnieki',
    nameAkuVsk: 'pētnieku',
    nameAkuDsk: 'pētniekus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.TIRGUS],
    value: 100,
    attributes: {
      lastUsed: 0,
      foundItemKey: '',
    },
    removedOnUse: false,
    use: petnieks,
  },

  // -- atkritumi --
  kartona_kaste: {
    nameNomVsk: 'kartona kaste',
    nameNomDsk: 'kartona kastes',
    nameAkuVsk: 'kartona kasti',
    nameAkuDsk: 'kartona kastes',
    isVirsiesuDzimte: false,
    emoji: {
      id: '1009557002667687958',
      name: 'kartona_kaste',
    },
    categories: [ItemCategory.ATKRITUMI],
    value: 15,
  },
  pudele: {
    nameNomVsk: 'stikla pudele',
    nameNomDsk: 'stikla pudeles',
    nameAkuVsk: 'stikla pudeli',
    nameAkuDsk: 'stikla pudeles',
    isVirsiesuDzimte: false,
    emoji: {
      id: '1009557011526074438',
      name: 'pudele',
    },
    categories: [ItemCategory.ATKRITUMI],
    value: 10,
  },
  metalluznis: {
    nameNomVsk: 'metāllūznis',
    nameNomDsk: 'metāllūžņi',
    nameAkuVsk: 'metāllūzni',
    nameAkuDsk: 'metāllūžņus',
    isVirsiesuDzimte: true,
    emoji: {
      id: '1009557007424040970',
      name: 'metalluznis',
    },
    categories: [ItemCategory.ATKRITUMI],
    value: 10,
  },

  // -- zivis --
  lidaka: {
    nameNomVsk: 'līdaka',
    nameNomDsk: 'līdakas',
    nameAkuVsk: 'līdaku',
    nameAkuDsk: 'līdakas',
    isVirsiesuDzimte: false,
    emoji: null,
    categories: [ItemCategory.ZIVIS],
    value: 10,
  },
  asaris: {
    nameNomVsk: 'asaris',
    nameNomDsk: 'asari',
    nameAkuVsk: 'asari',
    nameAkuDsk: 'asarus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.ZIVIS],
    value: 15,
  },
  lasis: {
    nameNomVsk: 'lasis',
    nameNomDsk: 'laši',
    nameAkuVsk: 'lasi',
    nameAkuDsk: 'lašus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.ZIVIS],
    value: 20,
  },
  loto_zivs: {
    nameNomVsk: 'loto zivs',
    nameNomDsk: 'loto zivis',
    nameAkuVsk: 'loto zivi',
    nameAkuDsk: 'loto zivis',
    isVirsiesuDzimte: false,
    emoji: null,
    categories: [ItemCategory.ZIVIS],
    value: 50,
  },
  juridiska_zivs: {
    nameNomVsk: 'juridiskā zivs',
    nameNomDsk: 'juridiskās zivis',
    nameAkuVsk: 'juridisko zivi',
    nameAkuDsk: 'juridiskās zivis',
    isVirsiesuDzimte: false,
    emoji: null,
    categories: [ItemCategory.ZIVIS],
    value: 50,
    removedOnUse: true,
    use: juridiska_zivs,
  },
  divaina_zivs: {
    nameNomVsk: 'dīvainā zivs',
    nameNomDsk: 'dīvainās zivis',
    nameAkuVsk: 'dīvano zivi',
    nameAkuDsk: 'dīvainās zivis',
    isVirsiesuDzimte: false,
    emoji: null,
    categories: [ItemCategory.ZIVIS],
    value: 50,
  },
  pulkstens_zivs: {
    nameNomVsk: 'pulkstens zivs',
    nameNomDsk: 'pulkstens zivis',
    nameAkuVsk: 'pulkstens zivi',
    nameAkuDsk: 'pulkstens zivis',
    isVirsiesuDzimte: false,
    emoji: null,
    categories: [ItemCategory.ZIVIS],
    value: 100,
  },

  // -- velosipēds --
  velosipeds: {
    nameNomVsk: 'velosipēds',
    nameNomDsk: 'velosipēdi',
    nameAkuVsk: 'velosipēdu',
    nameAkuDsk: 'velosipēdus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.OTHER],
    value: 500,
  },
  velo_ramis: {
    nameNomVsk: 'velosipēda rāmis',
    nameNomDsk: 'velosipēda rāmji',
    nameAkuVsk: 'velosipēda rāmi',
    nameAkuDsk: 'velosipēda rāmjus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.OTHER],
    value: 10,
    use: velo,
  },
  velo_ritenis: {
    nameNomVsk: 'velosipēda ritenis',
    nameNomDsk: 'velosipēda riteņi',
    nameAkuVsk: 'velosipēda riteni',
    nameAkuDsk: 'velosipēda riteņus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.OTHER],
    value: 10,
    use: velo,
  },
  velo_kede: {
    nameNomVsk: 'velosipēda ķēde',
    nameNomDsk: 'velosipēda ķēdes',
    nameAkuVsk: 'velosipēda ķēdi',
    nameAkuDsk: 'velosipēda ķēdes',
    isVirsiesuDzimte: false,
    emoji: null,
    categories: [ItemCategory.OTHER],
    value: 10,
    use: velo,
  },
  velo_sture: {
    nameNomVsk: 'velosipēda stūre',
    nameNomDsk: 'velosipēda stūres',
    nameAkuVsk: 'velosipēda stūri',
    nameAkuDsk: 'velosipēda stūres',
    isVirsiesuDzimte: false,
    emoji: null,
    categories: [ItemCategory.OTHER],
    value: 10,
    use: velo,
  },

  // -- citas mantas --
  kafija: {
    nameNomVsk: 'kafija',
    nameNomDsk: 'kafijas',
    nameAkuVsk: 'kafiju',
    nameAkuDsk: 'kafijas',
    isVirsiesuDzimte: false,
    emoji: {
      id: '1009557001451356161',
      name: 'kafija',
    },
    categories: [ItemCategory.OTHER],
    value: 50,
    allowDiscount: true,
    removedOnUse: false,
    use: kafija,
  },

  // -- brīvgriezieni --
  brivgriez10: {
    nameNomVsk: '10 latu brīvgrieziens',
    nameNomDsk: '10 latu brīvgriezieni',
    nameAkuVsk: '10 latu brīvgriezienu',
    nameAkuDsk: '10 latu brīvgriezienus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.BRIVGRIEZIENS],
    value: 1,
    removedOnUse: false,
  },
  brivgriez25: {
    nameNomVsk: '25 latu brīvgrieziens',
    nameNomDsk: '25 latu brīvgriezieni',
    nameAkuVsk: '25 latu brīvgriezienu',
    nameAkuDsk: '25 latu brīvgriezienus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.BRIVGRIEZIENS],
    value: 1,
    removedOnUse: false,
  },
  brivgriez50: {
    nameNomVsk: '50 latu brīvgrieziens',
    nameNomDsk: '50 latu brīvgriezieni',
    nameAkuVsk: '50 latu brīvgriezienu',
    nameAkuDsk: '50 latu brīvgriezienus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.BRIVGRIEZIENS],
    value: 1,
    removedOnUse: false,
  },
  brivgriez100: {
    nameNomVsk: '100 latu brīvgrieziens',
    nameNomDsk: '100 latu brīvgriezieni',
    nameAkuVsk: '100 latu brīvgriezienu',
    nameAkuDsk: '100 latu brīvgriezienus',
    isVirsiesuDzimte: true,
    emoji: null,
    categories: [ItemCategory.BRIVGRIEZIENS],
    value: 1,
    removedOnUse: false,
  },
};

export default itemList;
