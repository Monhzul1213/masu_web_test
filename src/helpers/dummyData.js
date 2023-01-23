export const payTypes = [
  { label: 'Карт', value: 'Карт' },
  { label: 'Дансаар', value: 'Дансаар' },
  { label: 'QPay', value: 'QPay' },
  { label: 'Mchat', value: 'Mchat' },
  { label: 'Бусад', value: 'Бусад' },
];

export const payShops = [
  { label: 'Shop1', value: 'Shop1', address: '15th street', qty: 2 },
  { label: 'Shop name 2', value: 'Shop2', address: '17th street', qty: 1 },
  { label: 'Shop name sub shop 3', value: 'Shop3', address: '25th street', qty: 1 },
  { label: 'Shop4', value: 'Shop4', address: '25th street', qty: 1 },
  { label: 'Shop5', value: 'Shop5', address: '25th street', qty: 1 },
  { label: 'Shop6', value: 'Shop6', address: '25th street', qty: 1 },
  { label: 'Shop7', value: 'Shop7', address: '25th street', qty: 1 },
  { label: 'Shop8', value: 'Shop8', address: '25th street', qty: 1 },
  { label: 'Shop9', value: 'Shop9', address: '25th street', qty: 1 },
];

export const colors = [
  '#e0e0e0',
  '#f44336',
  '#e91e63',
  '#ff9800',
  '#cddc39',
  '#4caf50',
  '#2196f3',
  '#9c27b0'
];

export const posTypes = [
  { value: "Windows", label: "Windows" },
  { value: "Android", label: "Android" },
  { value: "iOS", label: "iOS" }
];

export const posList = [
  { label: 'Бүх борлуулалтыг харах', value: 'posViewReceipt', checked: false },
  { label: 'Хөнгөлөлт ашиглах', value: 'posDiscount', checked: false },
  { label: 'Борлуулалт болон татвар өөрчлөх', value: 'posChangeSalesTaxes', checked: false },
  { label: 'Буцаалт авах', value: 'posReturn', checked: false },
  { label: 'Бүх нээлттэй захиалгыг удирдах', value: 'posManageTicket', checked: false },
  { label: 'Нээлттэй захиалгыг хүчингүй болгох', value: 'posVoidTicket', checked: false },
  { label: 'Ээлжийн тайлан харах', value: 'posViewShiftReport', checked: false },
  { label: 'Мөнгөний шургуулга нээх', value: 'posOpenCashDrawer', checked: false },
  { label: 'Баримт дахин хэвлэх', value: 'posReprintReceipt', checked: false },
  { label: 'Бараа бүртгэх', value: 'posManageItems', checked: false },
  { label: 'Тохиргоо өөрчлөх', value: 'posChangeSettings', checked: false },
  { label: 'Чатад хандах', value: 'posChat', checked: false },
  { label: 'Чатад хариу өгөх', value: 'posLiveChatSuport', checked: false },
];

export const webList = [
  { label: 'Борлуулалтын тайлан харах', value: 'webViewSalesReport', checked: false },
  { label: 'Борлуулалт хүчингүй болгох', value: 'webCancelReceipts', checked: false },
  { label: 'Бараа бүртгэх', value: 'webManageItem', checked: false },
  { label: 'Ажилтан бүртгэх', value: 'webManageEmployy', checked: false },
  { label: 'Харилцагч бүртгэх', value: 'webManageCustomer', checked: false },
  { label: 'Тохиргоо өөрчлөх', value: 'webEditSettings', checked: false },
  { label: 'Тооцоог бүртгэх', value: 'webManageBilling', checked: false },
  { label: 'Төлбөрийн төрөл бүртгэх', value: 'webManagePaymentType', checked: false },
  { label: 'Хөнгөлөлт бүртгэх', value: 'webManageLoyalty', checked: false },
  { label: 'Татвар бүртгэх', value: 'webManageTaxes', checked: false },
  { label: 'Kitchen принтер бүртгэх', value: 'webManageKitchenPrinter', checked: false },
  { label: 'Хоолны сонголт бүртгэх', value: 'webManageDinigOptions', checked: false },
  { label: 'ПОС бүртгэх', value: 'webManagePos', checked: false },
  { label: 'Чат харах', value: 'webManageChat', checked: false },
];

export const timeList = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00',
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00', '23:00'
];
export const chartTypes = [
  { label: 'Line', value: 'line' },
  { label: 'Bar', value: 'bar' },
  { label: 'Pie', value: 'pie' },
];

export const limitList = [
  { value: 0, label: 'Нас харгалзахгүй' },
  { value: 16, label: '16 дээш ' },
  { value: 18, label: '18 дээш ' },
  { value: 21, label: '21 дээш ' },
]

export const graphList = [
  { value: true, label: 'Bar' },
  { value: false, label: 'Area' },
];

export const graphList1 = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
];

export const zipTypes = [
  'application/x-freearc',
  'application/x-bzip',
  'application/x-bzip2',
  'application/gzip',
  'application/vnd.rar',
  'application/x-tar',
  'application/zip',
  'application/x-7z-compressed',
  'application/x-zip-compressed',
  'zip'
];

export const cityList = [
  { label: 'Багануур дүүрэг', value: 'Багануур дүүрэг' },
  { label: 'Багахангай дүүрэг', value: 'Багахангай дүүрэг' },
  { label: 'Баянгол дүүрэг', value: 'Баянгол дүүрэг' },
  { label: 'Баянзүрх дүүрэг', value: 'Баянзүрх дүүрэг' },
  { label: 'Налайх дүүрэг', value: 'Налайх дүүрэг' },
  { label: 'Сонгинохайрхан дүүрэг', value: 'Сонгинохайрхан дүүрэг' },
  { label: 'Сүхбаатар дүүрэг', value: 'Сүхбаатар дүүрэг' },
  { label: 'Хан-Уул дүүрэг', value: 'Хан-Уул дүүрэг' },
  { label: 'Чингэлтэй дүүрэг', value: 'Чингэлтэй дүүрэг' },
  { label: 'Архангай аймаг', value: 'Архангай аймаг' },
  { label: 'Баян-Өлгий аймаг', value: 'Баян-Өлгий аймаг' },
  { label: 'Баянхонгор аймаг', value: 'Баянхонгор аймаг' },
  { label: 'Булган аймаг', value: 'Булган аймаг' },
  { label: 'Говь-Алтай аймаг', value: 'Говь-Алтай аймаг' },
  { label: 'Говьсүмбэр аймаг', value: 'Говьсүмбэр аймаг' },
  { label: 'Дархан-Уул аймаг', value: 'Дархан-Уул аймаг' },
  { label: 'Дорноговь аймаг', value: 'Дорноговь аймаг' },
  { label: 'Дорнод аймаг', value: 'Дорнод аймаг' },
  { label: 'Дундговь аймаг', value: 'Дундговь аймаг' },
  { label: 'Завхан аймаг', value: 'Завхан аймаг' },
  { label: 'Орхон аймаг', value: 'Орхон аймаг ' },
  { label: 'Өвөрхангай аймаг', value: 'Өвөрхангай аймаг' },
  { label: 'Өмнөговь аймаг', value: 'Өмнөговь аймаг' },
  { label: 'Сүхбаатар аймаг', value: 'Сүхбаатар аймаг' },
  { label: 'Сэлэнгэ аймаг', value: 'Сэлэнгэ аймаг' },
  { label: 'Төв аймаг', value: 'Төв аймаг' },
  { label: 'Увс аймаг', value: 'Увс аймаг' },
  { label: 'Ховд аймаг', value: 'Ховд аймаг' },
  { label: 'Хөвсгөл аймаг', value: 'Хөвсгөл аймаг' },
  { label: 'Хэнтий аймаг', value: 'Хэнтий аймаг' },
];
export const districtList = [
  { parent: 'Багануур дүүрэг,Багахангай дүүрэг,Баянгол дүүрэг,Баянзүрх дүүрэг,Налайх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '1-р хороо', value: '1-р хороо' },
  { parent: 'Багануур дүүрэг,Багахангай дүүрэг,Баянгол дүүрэг,Баянзүрх дүүрэг,Налайх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '2-р хороо', value: '2-р хороо' },
  { parent: 'Багануур дүүрэг,Багахангай дүүрэг,Баянгол дүүрэг,Баянзүрх дүүрэг,Налайх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '3-р хороо', value: '3-р хороо' },
  { parent: 'Багануур дүүрэг,Багахангай дүүрэг,Баянгол дүүрэг,Баянзүрх дүүрэг,Налайх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '4-р хороо', value: '4-р хороо' },
  { parent: 'Багануур дүүрэг,Багахангай дүүрэг,Баянгол дүүрэг,Баянзүрх дүүрэг,Налайх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '5-р хороо', value: '5-р хороо' },

  { parent: 'Багахангай дүүрэг,Баянгол дүүрэг,Баянзүрх дүүрэг,Налайх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '6-р хороо', value: '6-р хороо' },
  { parent: 'Багахангай дүүрэг,Баянгол дүүрэг,Баянзүрх дүүрэг,Налайх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '7-р хороо', value: '7-р хороо' },
  { parent: 'Багахангай дүүрэг,Баянгол дүүрэг,Баянзүрх дүүрэг,Налайх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '8-р хороо', value: '8-р хороо' },
  
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '9-р хороо', value: '9-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '10-р хороо', value: '10-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '11-р хороо', value: '11-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '12-р хороо', value: '12-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '13-р хороо', value: '13-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '14-р хороо', value: '14-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '15-р хороо', value: '15-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '16-р хороо', value: '16-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '17-р хороо', value: '17-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '18-р хороо', value: '18-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг,Чингэлтэй дүүрэг', label: '19-р хороо', value: '19-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Сүхбаатар дүүрэг,Хан-Уул дүүрэг', label: '20-р хороо', value: '20-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг,Хан-Уул дүүрэг', label: '21-р хороо', value: '21-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг', label: '22-р хороо', value: '22-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг', label: '23-р хороо', value: '23-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг', label: '24-р хороо', value: '24-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг', label: '25-р хороо', value: '25-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг', label: '26-р хороо', value: '26-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг', label: '27-р хороо', value: '27-р хороо' },
  { parent: 'Баянгол дүүрэг,Баянзүрх дүүрэг,Сонгинохайрхан дүүрэг', label: '28-р хороо', value: '28-р хороо' },
  { parent: 'Баянгол дүүрэг,Сонгинохайрхан дүүрэг', label: '29-р хороо', value: '29-р хороо' },
  { parent: 'Баянгол дүүрэг,Сонгинохайрхан дүүрэг', label: '30-р хороо', value: '30-р хороо' },
  { parent: 'Баянгол дүүрэг,Сонгинохайрхан дүүрэг', label: '31-р хороо', value: '31-р хороо' },
  { parent: 'Баянгол дүүрэг,Сонгинохайрхан дүүрэг', label: '32-р хороо', value: '32-р хороо' },
  { parent: 'Баянгол дүүрэг,Сонгинохайрхан дүүрэг', label: '33-р хороо', value: '33-р хороо' },

  { parent: 'Сонгинохайрхан дүүрэг', label: '34-р хороо', value: '34-р хороо' },
  { parent: 'Сонгинохайрхан дүүрэг', label: '35-р хороо', value: '35-р хороо' },
  { parent: 'Сонгинохайрхан дүүрэг', label: '36-р хороо', value: '36-р хороо' },
  { parent: 'Сонгинохайрхан дүүрэг', label: '37-р хороо', value: '37-р хороо' },
  { parent: 'Сонгинохайрхан дүүрэг', label: '38-р хороо', value: '38-р хороо' },
  { parent: 'Сонгинохайрхан дүүрэг', label: '39-р хороо', value: '39-р хороо' },
  { parent: 'Сонгинохайрхан дүүрэг', label: '40-р хороо', value: '40-р хороо' },
  { parent: 'Сонгинохайрхан дүүрэг', label: '41-р хороо', value: '41-р хороо' },
  { parent: 'Сонгинохайрхан дүүрэг', label: '42-р хороо', value: '42-р хороо' },
  { parent: 'Сонгинохайрхан дүүрэг', label: '43-р хороо', value: '33-р хороо' },

  { parent: 'Архангай аймаг', label: 'Цэцэрлэг', value: 'Цэцэрлэг' },
  { parent: 'Архангай аймаг', label: 'Батцэнгэл', value: 'Батцэнгэл' },
  { parent: 'Архангай аймаг', label: 'Булган', value: 'Булган' },
  { parent: 'Архангай аймаг', label: 'Жаргалант', value: 'Жаргалант' },
  { parent: 'Архангай аймаг', label: 'Ихтамир', value: 'Ихтамир' },
  { parent: 'Архангай аймаг', label: 'Өгийнуур', value: 'Өгийнуур' },
  { parent: 'Архангай аймаг', label: 'Өлзийт', value: 'Өлзийт' },
  { parent: 'Архангай аймаг', label: 'Өндөр-Улаан', value: 'Өндөр-Улаан' },
  { parent: 'Архангай аймаг', label: 'Тариат', value: 'Тариат' },
  { parent: 'Архангай аймаг', label: 'Төвшрүүлэх', value: 'Төвшрүүлэх' },
  { parent: 'Архангай аймаг', label: 'Хайрхан', value: 'Хайрхан' },
  { parent: 'Архангай аймаг', label: 'Хангай', value: 'Хангай' },
  { parent: 'Архангай аймаг', label: 'Хашаат', value: 'Хашаат' },
  { parent: 'Архангай аймаг', label: 'Хотонт', value: 'Хотонт' },
  { parent: 'Архангай аймаг', label: 'Цахир', value: 'Цахир' },
  { parent: 'Архангай аймаг', label: 'Цэнхэр', value: 'Цэнхэр' },
  { parent: 'Архангай аймаг', label: 'Чулуут', value: 'Чулуут' },
  { parent: 'Архангай аймаг', label: 'Эрдэнэбулган', value: 'Эрдэнэбулган' },
  { parent: 'Архангай аймаг', label: 'Эрдэнэмандал', value: 'Эрдэнэмандал' },

  { parent: 'Баян-Өлгий аймаг', label: 'Өлгий', value: 'Өлгий' },
  { parent: 'Баян-Өлгий аймаг', label: 'Алтай', value: 'Алтай' },
  { parent: 'Баян-Өлгий аймаг', label: 'Алтанцөгц', value: 'Алтанцөгц' },
  { parent: 'Баян-Өлгий аймаг', label: 'Баяннуур', value: 'Баяннуур' },
  { parent: 'Баян-Өлгий аймаг', label: 'Бугат', value: 'Бугат' },
  { parent: 'Баян-Өлгий аймаг', label: 'Булган', value: 'Булган' },
  { parent: 'Баян-Өлгий аймаг', label: 'Буянт', value: 'Буянт' },
  { parent: 'Баян-Өлгий аймаг', label: 'Дэлүүн', value: 'Дэлүүн' },
  { parent: 'Баян-Өлгий аймаг', label: 'Ногооннуур', value: 'Ногооннуур' },
  { parent: 'Баян-Өлгий аймаг', label: 'Сагсай', value: 'Сагсай' },
  { parent: 'Баян-Өлгий аймаг', label: 'Толбо', value: 'Толбо' },
  { parent: 'Баян-Өлгий аймаг', label: 'Улаанхус', value: 'Улаанхус' },
  { parent: 'Баян-Өлгий аймаг', label: 'Цагааннуур', value: 'Цагааннуур' },
  { parent: 'Баян-Өлгий аймаг', label: 'Цэнгэл', value: 'Цэнгэл' },

  { parent: 'Баянхонгор аймаг', label: 'Баянхонгор', value: 'Баянхонгор' },
  { parent: 'Баянхонгор аймаг', label: 'Баацагаан', value: 'Баацагаан' },
  { parent: 'Баянхонгор аймаг', label: 'Баянбулаг', value: 'Баянбулаг' },
  { parent: 'Баянхонгор аймаг', label: 'Баянговь', value: 'Баянговь' },
  { parent: 'Баянхонгор аймаг', label: 'Баянлиг', value: 'Баянлиг' },
  { parent: 'Баянхонгор аймаг', label: 'Баян-Овоо', value: 'Баян-Овоо' },
  { parent: 'Баянхонгор аймаг', label: 'Баян-Өндөр', value: 'Баян-Өндөр' },
  { parent: 'Баянхонгор аймаг', label: 'Баянцагаан', value: 'Баянцагаан' },
  { parent: 'Баянхонгор аймаг', label: 'Богд', value: 'Богд' },
  { parent: 'Баянхонгор аймаг', label: 'Бөмбөгөр', value: 'Бөмбөгөр' },
  { parent: 'Баянхонгор аймаг', label: 'Бууцагаан', value: 'Бууцагаан' },
  { parent: 'Баянхонгор аймаг', label: 'Галуут', value: 'Галуут' },
  { parent: 'Баянхонгор аймаг', label: 'Гурванбулаг', value: 'Гурванбулаг' },
  { parent: 'Баянхонгор аймаг', label: 'Жаргалант', value: 'Жаргалант' },
  { parent: 'Баянхонгор аймаг', label: 'Жинст', value: 'Жинст' },
  { parent: 'Баянхонгор аймаг', label: 'Заг', value: 'Заг' },
  { parent: 'Баянхонгор аймаг', label: 'Өлзийт', value: 'Өлзийт' },
  { parent: 'Баянхонгор аймаг', label: 'Хүрээмарал', value: 'Хүрээмарал' },
  { parent: 'Баянхонгор аймаг', label: 'Шинэжинст', value: 'Шинэжинст' },
  { parent: 'Баянхонгор аймаг', label: 'Эрдэнэцогт', value: 'Эрдэнэцогт' },

  { parent: 'Булган аймаг', label: 'Баян-Агт', value: 'Баян-Агт' },
  { parent: 'Булган аймаг', label: 'Баяннуур', value: 'Баяннуур' },
  { parent: 'Булган аймаг', label: 'Бугат', value: 'Бугат' },
  { parent: 'Булган аймаг', label: 'Бүрэгхангай', value: 'Бүрэгхангай' },
  { parent: 'Булган аймаг', label: 'Гурванбулаг', value: 'Гурванбулаг' },
  { parent: 'Булган аймаг', label: 'Дашинчилэн', value: 'Дашинчилэн' },
  { parent: 'Булган аймаг', label: 'Могод', value: 'Могод' },
  { parent: 'Булган аймаг', label: 'Орхон', value: 'Орхон' },
  { parent: 'Булган аймаг', label: 'Рашаант', value: 'Рашаант' },
  { parent: 'Булган аймаг', label: 'Сайхан', value: 'Сайхан' },
  { parent: 'Булган аймаг', label: 'Сэлэнгэ', value: 'Сэлэнгэ' },
  { parent: 'Булган аймаг', label: 'Тэшиг', value: 'Тэшиг' },
  { parent: 'Булган аймаг', label: 'Хангал', value: 'Хангал' },
  { parent: 'Булган аймаг', label: 'Хишиг-Өндөр', value: 'Хишиг-Өндөр' },
  { parent: 'Булган аймаг', label: 'Хутаг-Өндөр<', value: 'Хутаг-Өндөр<' },

  { parent: 'Говь-Алтай аймаг', label: 'Алтай', value: 'Алтай' },
  { parent: 'Говь-Алтай аймаг', label: 'Баян-Уул', value: 'Баян-Уул' },
  { parent: 'Говь-Алтай аймаг', label: 'Бигэр', value: 'Бигэр' },
  { parent: 'Говь-Алтай аймаг', label: 'Бугат', value: 'Бугат' },
  { parent: 'Говь-Алтай аймаг', label: 'Дарви', value: 'Дарви' },
  { parent: 'Говь-Алтай аймаг', label: 'Дэлгэр', value: 'Дэлгэр' },
  { parent: 'Говь-Алтай аймаг', label: 'Жаргалан', value: 'Жаргалан' },
  { parent: 'Говь-Алтай аймаг', label: 'Есөнбулаг', value: 'Есөнбулаг' },
  { parent: 'Говь-Алтай аймаг', label: 'Тайшир', value: 'Тайшир' },
  { parent: 'Говь-Алтай аймаг', label: 'Тонхил', value: 'Тонхил' },
  { parent: 'Говь-Алтай аймаг', label: 'Төгрөг', value: 'Төгрөг' },
  { parent: 'Говь-Алтай аймаг', label: 'Халиун', value: 'Халиун' },
  { parent: 'Говь-Алтай аймаг', label: 'Хөхморьт', value: 'Хөхморьт' },
  { parent: 'Говь-Алтай аймаг', label: 'Цогт', value: 'Цогт' },
  { parent: 'Говь-Алтай аймаг', label: 'Цээл', value: 'Цээл' },
  { parent: 'Говь-Алтай аймаг', label: 'Чандмань', value: 'Чандмань' },
  { parent: 'Говь-Алтай аймаг', label: 'Шарга', value: 'Шарга' },
  { parent: 'Говь-Алтай аймаг', label: 'Эрдэнэ', value: 'Эрдэнэ' },

  { parent: 'Говьсүмбэр аймаг', label: 'Чойр', value: 'Чойр' },
  { parent: 'Говьсүмбэр аймаг', label: 'Сүмбэр', value: 'Сүмбэр' },
  { parent: 'Говьсүмбэр аймаг', label: 'Баянтал', value: 'Баянтал' },
  { parent: 'Говьсүмбэр аймаг', label: 'Шивээговь', value: 'Шивээговь' },

  { parent: 'Дархан-Уул аймаг', label: 'Дархан', value: 'Дархан' },
  { parent: 'Дархан-Уул аймаг', label: 'Орхон', value: 'Орхон' },
  { parent: 'Дархан-Уул аймаг', label: 'Хонгор', value: 'Хонгор' },
  { parent: 'Дархан-Уул аймаг', label: 'Шарын гол', value: 'Шарын гол' },

  { parent: 'Дорноговь аймаг', label: 'Сайншанд', value: 'Сайншанд' },
  { parent: 'Дорноговь аймаг', label: 'Айраг', value: 'Айраг' },
  { parent: 'Дорноговь аймаг', label: 'Алтанширээ', value: 'Алтанширээ' },
  { parent: 'Дорноговь аймаг', label: 'Даланжаргалан', value: 'Даланжаргалан' },
  { parent: 'Дорноговь аймаг', label: 'Дэлгэрэх', value: 'Дэлгэрэх' },
  { parent: 'Дорноговь аймаг', label: 'Замын-Үүд', value: 'Замын-Үүд' },
  { parent: 'Дорноговь аймаг', label: 'Иххэт', value: 'Иххэт' },
  { parent: 'Дорноговь аймаг', label: 'Мандах', value: 'Мандах' },
  { parent: 'Дорноговь аймаг', label: 'Өргөн', value: 'Өргөн' },
  { parent: 'Дорноговь аймаг', label: 'Сайхандулаан', value: 'Сайхандулаан' },
  { parent: 'Дорноговь аймаг', label: 'Улаанбадрах', value: 'Улаанбадрах' },
  { parent: 'Дорноговь аймаг', label: 'Хатанбулаг', value: 'Хатанбулаг' },
  { parent: 'Дорноговь аймаг', label: 'Хөвсгөл', value: 'Хөвсгөл' },
  { parent: 'Дорноговь аймаг', label: 'Эрдэнэ', value: 'Эрдэнэ' },

  { parent: 'Дорнод аймаг', label: 'Чойбалсан', value: 'Чойбалсан' },
  { parent: 'Дорнод аймаг', label: 'Баяндун', value: 'Баяндун' },
  { parent: 'Дорнод аймаг', label: 'Баянтүмэн', value: 'Баянтүмэн' },
  { parent: 'Дорнод аймаг', label: 'Баян-Уул', value: 'Баян-Уул' },
  { parent: 'Дорнод аймаг', label: 'Булган', value: 'Булган' },
  { parent: 'Дорнод аймаг', label: 'Гурванзагал', value: 'Гурванзагал' },
  { parent: 'Дорнод аймаг', label: 'Дашбалбар', value: 'Дашбалбар' },
  { parent: 'Дорнод аймаг', label: 'Матад', value: 'Матад' },
  { parent: 'Дорнод аймаг', label: 'Сэргэлэн', value: 'Сэргэлэн' },
  { parent: 'Дорнод аймаг', label: 'Халхгол', value: 'Халхгол' },
  { parent: 'Дорнод аймаг', label: 'Хөлөнбуйр', value: 'Хөлөнбуйр' },
  { parent: 'Дорнод аймаг', label: 'Хэрлэн', value: 'Хэрлэн' },
  { parent: 'Дорнод аймаг', label: 'Цагаан-Овоо', value: 'Цагаан-Овоо' },
  { parent: 'Дорнод аймаг', label: 'Чулуунхороот', value: 'Чулуунхороот' },

  { parent: 'Дундговь аймаг', label: 'Мандалговь', value: 'Мандалговь' },
  { parent: 'Дундговь аймаг', label: 'Адаацаг', value: 'Адаацаг' },
  { parent: 'Дундговь аймаг', label: 'Баянжаргалан', value: 'Баянжаргалан' },
  { parent: 'Дундговь аймаг', label: 'Говь-Угтаал', value: 'Говь-Угтаал' },
  { parent: 'Дундговь аймаг', label: 'Гурвансайхан', value: 'Гурвансайхан' },
  { parent: 'Дундговь аймаг', label: 'Дэлгэрхангай', value: 'Дэлгэрхангай' },
  { parent: 'Дундговь аймаг', label: 'Дэлгэрцогт', value: 'Дэлгэрцогт' },
  { parent: 'Дундговь аймаг', label: 'Дэрэн', value: 'Дэрэн' },
  { parent: 'Дундговь аймаг', label: 'Луус', value: 'Луус' },
  { parent: 'Дундговь аймаг', label: 'Өлзийт', value: 'Өлзийт' },
  { parent: 'Дундговь аймаг', label: 'Өндөршил', value: 'Өндөршил' },
  { parent: 'Дундговь аймаг', label: 'Сайнцагаан', value: 'Сайнцагаан' },
  { parent: 'Дундговь аймаг', label: 'Сайхан-Овоо', value: 'Сайхан-Овоо' },
  { parent: 'Дундговь аймаг', label: 'Хулд', value: 'Хулд' },
  { parent: 'Дундговь аймаг', label: 'Цагаандэлгэр', value: 'Цагаандэлгэр' },
  { parent: 'Дундговь аймаг', label: 'Эрдэнэдалай', value: 'Эрдэнэдалай' },

  { parent: 'Завхан аймаг', label: 'Улиастай', value: 'Улиастай' },
  { parent: 'Завхан аймаг', label: 'Алдархаан', value: 'Алдархаан' },
  { parent: 'Завхан аймаг', label: 'Асгат', value: 'Асгат' },
  { parent: 'Завхан аймаг', label: 'Баянтэс', value: 'Баянтэс' },
  { parent: 'Завхан аймаг', label: 'Баянхайрхан', value: 'Баянхайрхан' },
  { parent: 'Завхан аймаг', label: 'Дөрвөлжин', value: 'Дөрвөлжин' },
  { parent: 'Завхан аймаг', label: 'Завханмандал', value: 'Завханмандал' },
  { parent: 'Завхан аймаг', label: 'Идэр', value: 'Идэр' },
  { parent: 'Завхан аймаг', label: 'Их-Уул', value: 'Их-Уул' },
  { parent: 'Завхан аймаг', label: 'Нөмрөг', value: 'Нөмрөг' },
  { parent: 'Завхан аймаг', label: 'Отгон', value: 'Отгон' },
  { parent: 'Завхан аймаг', label: 'Сантмаргаз', value: 'Сантмаргаз' },
  { parent: 'Завхан аймаг', label: 'Сонгино', value: 'Сонгино' },
  { parent: 'Завхан аймаг', label: 'Тосонцэнгэл', value: 'Тосонцэнгэл' },
  { parent: 'Завхан аймаг', label: 'Түдэвтэй', value: 'Түдэвтэй' },
  { parent: 'Завхан аймаг', label: 'Тэлмэн', value: 'Тэлмэн' },
  { parent: 'Завхан аймаг', label: 'Тэс', value: 'Тэс' },
  { parent: 'Завхан аймаг', label: 'Ургамал', value: 'Ургамал' },
  { parent: 'Завхан аймаг', label: 'Цагаанхайрхан', value: 'Цагаанхайрхан' },
  { parent: 'Завхан аймаг', label: 'Цагаанчулуут', value: 'Цагаанчулуут' },
  { parent: 'Завхан аймаг', label: 'Цэцэн-Уул', value: 'Цэцэн-Уул' },
  { parent: 'Завхан аймаг', label: 'Шилүүстэй', value: 'Шилүүстэй' },
  { parent: 'Завхан аймаг', label: 'Эрдэнэхайрхан', value: 'Эрдэнэхайрхан' },
  { parent: 'Завхан аймаг', label: 'Яруу', value: 'Яруу' },

  { parent: 'Орхон аймаг', label: 'Эрдэнэт', value: 'Эрдэнэт' },
  { parent: 'Орхон аймаг', label: 'Баян-Өндөр', value: 'Баян-Өндөр' },
  { parent: 'Орхон аймаг', label: 'Жаргалант', value: 'Жаргалант' },

  { parent: 'Өвөрхангай аймаг', label: 'Арвайхээр', value: 'Арвайхээр' },
  { parent: 'Өвөрхангай аймаг', label: 'Баруунбаян-Улаан', value: 'Баруунбаян-Улаан' },
  { parent: 'Өвөрхангай аймаг', label: 'Бат-Өлзий', value: 'Бат-Өлзий' },
  { parent: 'Өвөрхангай аймаг', label: 'Баянгол', value: 'Баянгол' },
  { parent: 'Өвөрхангай аймаг', label: 'Баян-Өндөр', value: 'Баян-Өндөр' },
  { parent: 'Өвөрхангай аймаг', label: 'Богд', value: 'Богд' },
  { parent: 'Өвөрхангай аймаг', label: 'Бүрд', value: 'Бүрд' },
  { parent: 'Өвөрхангай аймаг', label: 'Гучин-Ус', value: 'Гучин-Ус' },
  { parent: 'Өвөрхангай аймаг', label: 'Есөнзүйл', value: 'Есөнзүйл' },
  { parent: 'Өвөрхангай аймаг', label: 'Зүүнбаян-Улаан', value: 'Зүүнбаян-Улаан' },
  { parent: 'Өвөрхангай аймаг', label: 'Нарийнтээл', value: 'Нарийнтээл' },
  { parent: 'Өвөрхангай аймаг', label: 'Өлзийт', value: 'Өлзийт' },
  { parent: 'Өвөрхангай аймаг', label: 'Сант', value: 'Сант' },
  { parent: 'Өвөрхангай аймаг', label: 'Тарагт', value: 'Тарагт' },
  { parent: 'Өвөрхангай аймаг', label: 'Төгрөг', value: 'Төгрөг' },
  { parent: 'Өвөрхангай аймаг', label: 'Уянга', value: 'Уянга' },
  { parent: 'Өвөрхангай аймаг', label: 'Хайрхандулаан', value: 'Хайрхандулаан' },
  { parent: 'Өвөрхангай аймаг', label: 'Хархорин', value: 'Хархорин' },
  { parent: 'Өвөрхангай аймаг', label: 'Хужирт', value: 'Хужирт' },

  { parent: 'Өмнөговь аймаг', label: 'Даланзадгад', value: 'Даланзадгад' },
  { parent: 'Өмнөговь аймаг', label: 'Баяндалай', value: 'Баяндалай' },
  { parent: 'Өмнөговь аймаг', label: 'Баян-Овоо', value: 'Баян-Овоо' },
  { parent: 'Өмнөговь аймаг', label: 'Булган', value: 'Булган' },
  { parent: 'Өмнөговь аймаг', label: 'Гурвантэс', value: 'Гурвантэс' },
  { parent: 'Өмнөговь аймаг', label: 'Мандал-Овоо', value: 'Мандал-Овоо' },
  { parent: 'Өмнөговь аймаг', label: 'Манлай', value: 'Манлай' },
  { parent: 'Өмнөговь аймаг', label: 'Ноён', value: 'Ноён' },
  { parent: 'Өмнөговь аймаг', label: 'Номгон', value: 'Номгон' },
  { parent: 'Өмнөговь аймаг', label: 'Сэврэй', value: 'Сэврэй' },
  { parent: 'Өмнөговь аймаг', label: 'Ханбогд', value: 'Ханбогд' },
  { parent: 'Өмнөговь аймаг', label: 'Ханхонгор', value: 'Ханхонгор' },
  { parent: 'Өмнөговь аймаг', label: 'Хүрмэн', value: 'Хүрмэн' },
  { parent: 'Өмнөговь аймаг', label: 'Цогт-Овоо', value: 'Цогт-Овоо' },
  { parent: 'Өмнөговь аймаг', label: 'Цогтцэций', value: 'Цогтцэций' },

  { parent: 'Сүхбаатар аймаг', label: 'Баруун-Урт', value: 'Баруун-Урт' },
  { parent: 'Сүхбаатар аймаг', label: 'Асгат', value: 'Асгат' },
  { parent: 'Сүхбаатар аймаг', label: 'Баяндэлгэр', value: 'Баяндэлгэр' },
  { parent: 'Сүхбаатар аймаг', label: 'Дарьганга', value: 'Дарьганга' },
  { parent: 'Сүхбаатар аймаг', label: 'Мөнххаан', value: 'Мөнххаан' },
  { parent: 'Сүхбаатар аймаг', label: 'Наран', value: 'Наран' },
  { parent: 'Сүхбаатар аймаг', label: 'Онгон', value: 'Онгон' },
  { parent: 'Сүхбаатар аймаг', label: 'Сүхбаатар', value: 'Сүхбаатар' },
  { parent: 'Сүхбаатар аймаг', label: 'Түвшинширээ', value: 'Түвшинширээ' },
  { parent: 'Сүхбаатар аймаг', label: 'Түмэнцогт', value: 'Түмэнцогт' },
  { parent: 'Сүхбаатар аймаг', label: 'Уулбаян', value: 'Уулбаян' },
  { parent: 'Сүхбаатар аймаг', label: 'Халзан', value: 'Халзан' },
  { parent: 'Сүхбаатар аймаг', label: 'Эрдэнэцагаан', value: 'Эрдэнэцагаан' },

  { parent: 'Сэлэнгэ аймаг', label: 'Сүхбаатар', value: 'Сүхбаатар' },
  { parent: 'Сэлэнгэ аймаг', label: 'Алтанбулаг', value: 'Алтанбулаг' },
  { parent: 'Сэлэнгэ аймаг', label: 'Баруунбүрэн', value: 'Баруунбүрэн' },
  { parent: 'Сэлэнгэ аймаг', label: 'Баянгол', value: 'Баянгол' },
  { parent: 'Сэлэнгэ аймаг', label: 'Ерөө', value: 'Ерөө' },
  { parent: 'Сэлэнгэ аймаг', label: 'Жавхлант', value: 'Жавхлант' },
  { parent: 'Сэлэнгэ аймаг', label: 'Зүүнбүрэн', value: 'Зүүнбүрэн' },
  { parent: 'Сэлэнгэ аймаг', label: 'Мандал', value: 'Мандал' },
  { parent: 'Сэлэнгэ аймаг', label: 'Орхон', value: 'Орхон' },
  { parent: 'Сэлэнгэ аймаг', label: 'Орхонтуул', value: 'Орхонтуул' },
  { parent: 'Сэлэнгэ аймаг', label: 'Сайхан', value: 'Сайхан' },
  { parent: 'Сэлэнгэ аймаг', label: 'Сант', value: 'Сант' },
  { parent: 'Сэлэнгэ аймаг', label: 'Түшиг', value: 'Түшиг' },
  { parent: 'Сэлэнгэ аймаг', label: 'Хушаат', value: 'Хушаат' },
  { parent: 'Сэлэнгэ аймаг', label: 'Хүдэр', value: 'Хүдэр' },
  { parent: 'Сэлэнгэ аймаг', label: 'Цагааннуур', value: 'Цагааннуур' },
  { parent: 'Сэлэнгэ аймаг', label: 'Шаамар', value: 'Шаамар' },

  { parent: 'Төв аймаг', label: 'Зуунмод', value: 'Зуунмод' },
  { parent: 'Төв аймаг', label: 'Алтанбулаг', value: 'Алтанбулаг' },
  { parent: 'Төв аймаг', label: 'Аргалант', value: 'Аргалант' },
  { parent: 'Төв аймаг', label: 'Архуст', value: 'Архуст' },
  { parent: 'Төв аймаг', label: 'Батсүмбэр', value: 'Батсүмбэр' },
  { parent: 'Төв аймаг', label: 'Баян', value: 'Баян' },
  { parent: 'Төв аймаг', label: 'Баяндэлгэр', value: 'Баяндэлгэр' },
  { parent: 'Төв аймаг', label: 'Баянжаргалан', value: 'Баянжаргалан' },
  { parent: 'Төв аймаг', label: 'Баян-Өнжүүл', value: 'Баян-Өнжүүл' },
  { parent: 'Төв аймаг', label: 'Баянхангай', value: 'Баянхангай' },
  { parent: 'Төв аймаг', label: 'Баянцагаан', value: 'Баянцагаан' },
  { parent: 'Төв аймаг', label: 'Баянцогт', value: 'Баянцогт' },
  { parent: 'Төв аймаг', label: 'Баянчандмань', value: 'Баянчандмань' },
  { parent: 'Төв аймаг', label: 'Борнуур', value: 'Борнуур' },
  { parent: 'Төв аймаг', label: 'Бүрэн', value: 'Бүрэн' },
  { parent: 'Төв аймаг', label: 'Дэлгэрхаан', value: 'Дэлгэрхаан' },
  { parent: 'Төв аймаг', label: 'Жаргалант', value: 'Жаргалант' },
  { parent: 'Төв аймаг', label: 'Заамар', value: 'Заамар' },
  { parent: 'Төв аймаг', label: 'Лүн', value: 'Лүн' },
  { parent: 'Төв аймаг', label: 'Мөнгөнморьт', value: 'Мөнгөнморьт' },
  { parent: 'Төв аймаг', label: 'Өндөрширээт', value: 'Өндөрширээт' },
  { parent: 'Төв аймаг', label: 'Сүмбэр', value: 'Сүмбэр' },
  { parent: 'Төв аймаг', label: 'Сэргэлэн', value: 'Сэргэлэн' },
  { parent: 'Төв аймаг', label: 'Угтаалцайдам', value: 'Угтаалцайдам' },
  { parent: 'Төв аймаг', label: 'Цээл', value: 'Цээл' },
  { parent: 'Төв аймаг', label: 'Эрдэнэ', value: 'Эрдэнэ' },
  { parent: 'Төв аймаг', label: 'Эрдэнэсант', value: 'Эрдэнэсант' },

  { parent: 'Увс аймаг', label: 'Улаангом', value: 'Улаангом' },
  { parent: 'Увс аймаг', label: 'Баруунтуруун', value: 'Баруунтуруун' },
  { parent: 'Увс аймаг', label: 'Бөхмөрөн', value: 'Бөхмөрөн' },
  { parent: 'Увс аймаг', label: 'Давст', value: 'Давст' },
  { parent: 'Увс аймаг', label: 'Завхан', value: 'Завхан' },
  { parent: 'Увс аймаг', label: 'Зүүнговь', value: 'Зүүнговь' },
  { parent: 'Увс аймаг', label: 'Зүүнхангай', value: 'Зүүнхангай' },
  { parent: 'Увс аймаг', label: 'Малчин', value: 'Малчин' },
  { parent: 'Увс аймаг', label: 'Наранбулаг', value: 'Наранбулаг' },
  { parent: 'Увс аймаг', label: 'Өлгий', value: 'Өлгий' },
  { parent: 'Увс аймаг', label: 'Өмнөговь', value: 'Өмнөговь' },
  { parent: 'Увс аймаг', label: 'Өндөрхангай', value: 'Өндөрхангай' },
  { parent: 'Увс аймаг', label: 'Сагил', value: 'Сагил' },
  { parent: 'Увс аймаг', label: 'Тариалан', value: 'Тариалан' },
  { parent: 'Увс аймаг', label: 'Түргэн', value: 'Түргэн' },
  { parent: 'Увс аймаг', label: 'Тэс', value: 'Тэс' },
  { parent: 'Увс аймаг', label: 'Ховд', value: 'Ховд' },
  { parent: 'Увс аймаг', label: 'Хяргас', value: 'Хяргас' },
  { parent: 'Увс аймаг', label: 'Цагаанхайрхан', value: 'Цагаанхайрхан' },

  { parent: 'Ховд аймаг', label: 'Ховд', value: 'Ховд' },
  { parent: 'Ховд аймаг', label: 'Алтай', value: 'Алтай' },
  { parent: 'Ховд аймаг', label: 'Булган', value: 'Булган' },
  { parent: 'Ховд аймаг', label: 'Буянт', value: 'Буянт' },
  { parent: 'Ховд аймаг', label: 'Дарви', value: 'Дарви' },
  { parent: 'Ховд аймаг', label: 'Дөргөн', value: 'Дөргөн' },
  { parent: 'Ховд аймаг', label: 'Дуут', value: 'Дуут' },
  { parent: 'Ховд аймаг', label: 'Жаргалант', value: 'Жаргалант' },
  { parent: 'Ховд аймаг', label: 'Зэрэг', value: 'Зэрэг' },
  { parent: 'Ховд аймаг', label: 'Манхан', value: 'Манхан' },
  { parent: 'Ховд аймаг', label: 'Мөнххайрхан', value: 'Мөнххайрхан' },
  { parent: 'Ховд аймаг', label: 'Мөст', value: 'Мөст' },
  { parent: 'Ховд аймаг', label: 'Мянгад', value: 'Мянгад' },
  { parent: 'Ховд аймаг', label: 'Үенч', value: 'Үенч' },
  { parent: 'Ховд аймаг', label: 'Цэцэг', value: 'Цэцэг' },
  { parent: 'Ховд аймаг', label: 'Чандмань', value: 'Чандмань' },
  { parent: 'Ховд аймаг', label: 'Эрдэнэбүрэн', value: 'Эрдэнэбүрэн' },

  { parent: 'Хөвсгөл аймаг', label: 'Мөрөн', value: 'Мөрөн' },
  { parent: 'Хөвсгөл аймаг', label: 'Алаг-Эрдэнэ', value: 'Алаг-Эрдэнэ' },
  { parent: 'Хөвсгөл аймаг', label: 'Арбулаг', value: 'Арбулаг' },
  { parent: 'Хөвсгөл аймаг', label: 'Баянзүрх', value: 'Баянзүрх' },
  { parent: 'Хөвсгөл аймаг', label: 'Бүрэнтогтох', value: 'Бүрэнтогтох' },
  { parent: 'Хөвсгөл аймаг', label: 'Галт', value: 'Галт' },
  { parent: 'Хөвсгөл аймаг', label: 'Жаргалант', value: 'Жаргалант' },
  { parent: 'Хөвсгөл аймаг', label: 'Их-Уул', value: 'Их-Уул' },
  { parent: 'Хөвсгөл аймаг', label: 'Рашаант', value: 'Рашаант' },
  { parent: 'Хөвсгөл аймаг', label: 'Рэнчинлхүмбэ', value: 'Рэнчинлхүмбэ' },
  { parent: 'Хөвсгөл аймаг', label: 'Тариалан', value: 'Тариалан' },
  { parent: 'Хөвсгөл аймаг', label: 'Тосонцэнгэл', value: 'Тосонцэнгэл' },
  { parent: 'Хөвсгөл аймаг', label: 'Төмөрбулаг', value: 'Төмөрбулаг' },
  { parent: 'Хөвсгөл аймаг', label: 'Түнэл', value: 'Түнэл' },
  { parent: 'Хөвсгөл аймаг', label: 'Улаан-Уул', value: 'Улаан-Уул' },
  { parent: 'Хөвсгөл аймаг', label: 'Ханх', value: 'Ханх' },
  { parent: 'Хөвсгөл аймаг', label: 'Хатгал', value: 'Хатгал' },
  { parent: 'Хөвсгөл аймаг', label: 'Цагааннуур', value: 'Цагааннуур' },
  { parent: 'Хөвсгөл аймаг', label: 'Цагаан-Уул', value: 'Цагаан-Уул' },
  { parent: 'Хөвсгөл аймаг', label: 'Цагаан-Үүр', value: 'Цагаан-Үүр' },
  { parent: 'Хөвсгөл аймаг', label: 'Цэцэрлэг', value: 'Цэцэрлэг' },
  { parent: 'Хөвсгөл аймаг', label: 'Чандмань-Өндөр', value: 'Чандмань-Өндөр' },
  { parent: 'Хөвсгөл аймаг', label: 'Шинэ-Идэр', value: 'Шинэ-Идэр' },
  { parent: 'Хөвсгөл аймаг', label: 'Эрдэнэбулган', value: 'Эрдэнэбулган' },

  { parent: 'Хэнтий аймаг', label: 'Чингис', value: 'Чингис' },
  { parent: 'Хэнтий аймаг', label: 'Батноров', value: 'Батноров' },
  { parent: 'Хэнтий аймаг', label: 'Батширээт', value: 'Батширээт' },
  { parent: 'Хэнтий аймаг', label: 'Баян-Адарга', value: 'Баян-Адарга' },
  { parent: 'Хэнтий аймаг', label: 'Баянмөнх', value: 'Баянмөнх' },
  { parent: 'Хэнтий аймаг', label: 'Баян-Овоо', value: 'Баян-Овоо' },
  { parent: 'Хэнтий аймаг', label: 'Баянхутаг', value: 'Баянхутаг' },
  { parent: 'Хэнтий аймаг', label: 'Биндэр', value: 'Биндэр' },
  { parent: 'Хэнтий аймаг', label: 'Бор-Өндөр', value: 'Бор-Өндөр' },
  { parent: 'Хэнтий аймаг', label: 'Галшар', value: 'Галшар' },
  { parent: 'Хэнтий аймаг', label: 'Дадал', value: 'Дадал' },
  { parent: 'Хэнтий аймаг', label: 'Дархан', value: 'Дархан' },
  { parent: 'Хэнтий аймаг', label: 'Дэлгэрхаан', value: 'Дэлгэрхаан' },
  { parent: 'Хэнтий аймаг', label: 'Жаргалтхаан', value: 'Жаргалтхаан' },
  { parent: 'Хэнтий аймаг', label: 'Мөрөн', value: 'Мөрөн' },
  { parent: 'Хэнтий аймаг', label: 'Норовлин', value: 'Норовлин' },
  { parent: 'Хэнтий аймаг', label: 'Өмнөдэлгэр', value: 'Өмнөдэлгэр' },
  { parent: 'Хэнтий аймаг', label: 'Хэрлэн', value: 'Хэрлэн' },
  { parent: 'Хэнтий аймаг', label: 'Цэнхэрмандал', value: 'Цэнхэрмандал' },
];