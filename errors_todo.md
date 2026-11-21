# Zoznam chýb – `src/` (TODO)

Revízia k 21.11.2026 (commit `75cdc7c`). Opravy sú v pracovnom adresári a nie sú commitnuté.
Čísla riadkov v popise chyby sa vzťahujú na **pôvodný stav** (commit `75cdc7c`).

Priorita: 🔴 kritické (pád / zlá funkcia) · 🟠 stredné (chybné správanie v niektorých prípadoch) · 🟡 drobné (čistota kódu, texty, varovania)

Stav: **103 zo 104 bodov opravených**. Otvorený je iba bod o jednotke rýchlosti vetra (sekcia 4, DevicesSpec).
Po opravách: `npx eslint .` nehlási žiadnu chybu (predtým 19), `vite build` prechádza. Za behu v prehliadači neotestované.

---

## 0. Build / prostredie

- [x] 🔴 **`npm run build` padá** – v `node_modules` chýbajú `chart.js` a `vue-chartjs` (aj `vue-gauge`), hoci sú v `package.json` aj v `package-lock.json`.
  - **Oprava:** spustený `npm install`, ktorý doinštaloval chýbajúce balíky. Build prechádza.
- [x] 🟡 `vue-gauge` je v závislostiach, ale nikde sa nepoužíva.
  - **Oprava:** `npm uninstall vue-gauge`, takže zmizol z `package.json` aj z `package-lock.json`.
- [x] 🟡 ESLint 9 s `.eslintrc.cjs` – ESLint 9 vyžaduje flat config, takže `npm run lint` nefungoval.
  - **Oprava:** nový [eslint.config.mjs](eslint.config.mjs) s rovnakými pravidlami ako predtým (`js.configs.recommended`, `vue flat/essential`, `skip-formatting`, globals browser + node). Zmazaný `.eslintrc.cjs`. Skript `lint` je teraz `eslint . --fix`, lebo `--ext` a `--ignore-path` ESLint 9 nepozná. Odstránený nepotrebný `@rushstack/eslint-patch`, pridané `@eslint/js` a `globals`.
- [x] 🟡 CSS sa importuje dvakrát (`bootstrap.css`, `bootstrap-vue-next.css`, `main.css` v `main.js` aj v `main.scss`). Sass `@import` je zastaraný.
  - **Oprava:** všetko externé CSS (Bootstrap, bootstrap-vue-next, MDI, Font Awesome) a `main.css` sa importuje raz v [main.js](src/main.js). [main.scss](src/assets/main.scss) už neobsahuje žiadny `@import`, ostala v ňom poznámka, ako pridávať vlastné štýly cez `@use`. Overené, že Bootstrap je vo výstupnom CSS iba raz a fonty FA aj MDI sa generujú.

---

## 1. Store / služby

### [stores/main.js](src/stores/main.js)
- [x] 🔴 L113 `checkUserPermission` – `user_permission.value.forEach` padne, ak je `user_permission` `null`.
  - **Oprava:** funkcia najprv overí prihláseného užívateľa a `Array.isArray(user_permission.value)`, inak vráti `false`. Nemôže spadnúť.
- [x] 🔴 L135-L137 `getActualUser` – vo vetve `401` číta `response.data.user.permission`, kým `user` je `null`, takže to padne.
  - **Oprava:** `getActualUser` už odpoveď sama nespracúva, iba zavolá novú `setUserData(response.data)`. Tá pri inom statuse ako 200 (alebo bez `user`) všetko vynuluje a nič z `user` nečíta.
- [x] 🟠 Nekonzistentný zdroj práv (`response.data.user.permission` v store vs. `response.data.permission` v LogInForm a MySettings).
  - **Oprava:** podľa backendu (`UsersPresenter::_sendUserJson`) je `permission` na najvyššej úrovni odpovede. Jediný zdroj je teraz `setUserData()`, ktorá berie `data.permission`.
- [x] 🟠 `getActualUser` v store duplikuje `getActualUser` v MySettings (s inou logikou).
  - **Oprava:** kópia v MySettings odstránená. Ostala jediná verzia v store. Pribudla `ensureUser()`, ktorá užívateľa načíta len raz a ďalšie volania čakajú na ten istý request. Používa ju router guard aj `App.vue`.
- [x] 🟠 L106-L108 `watch(() => devices, …)` sa nikdy nespustí (a keby áno, rozbil by menu).
  - **Oprava:** watcher odstránený (aj nepoužitý import `watch`).
- [x] 🟡 L123 `forEach(…, this)` – `this` v setup store nemá zmysel.
  - **Oprava:** `forEach` nahradil `Array.some()` bez `this`.
- [x] 🟡 `checkUserPermission` – pri viacerých záznamoch pre jeden resource rozhodne posledný.
  - **Oprava:** `some()` vráti `true`, ak právo dáva aspoň jeden záznam (`action == null`, teda všetky akcie, alebo `action` obsahuje danú akciu).
- [x] 🟡 `main_menu.value[3]` – index je napevno.
  - **Oprava:** nová pomocná funkcia `devicesMenuItem()` hľadá položku podľa `to === '/devices'`. Pribudla aj `clearDevicesMenu()`, ktorá sa volá pri odhlásení. `addDevicesToMenu` už nezapisuje `children` do objektov zariadení v `devices`.

### [services/MainService.js](src/services/MainService.js)
- [x] 🟠 L34 a L88 – `postDeviceUpdate` je definovaná dvakrát.
  - **Oprava:** druhá (duplicitná) definícia odstránená.
- [x] 🟠 Mazacie operácie cez GET: `getDeleteUnit`, `getSensorDelete` (a `getLogOut`).
  - **Oprava:** premenované a prepnuté na POST: `postDeleteUnit`, `postSensorDelete`, `postLogOut`. Volania upravené v [UnitsShow.vue](src/components/UnitsShow.vue), [SensorEdit.vue](src/components/Sensor/SensorEdit.vue) a [LogInForm.vue](src/components/LogInForm.vue). Backend (Nette) HTTP metódu nekontroluje, takže to funguje bez jeho zmeny. *Pozn.: plnú ochranu pred CSRF dá až to, keď backend GET pre tieto akcie odmietne.*
- [x] 🟡 `postDeviceDelete` existuje, ale nikde sa nepoužíva.
  - **Oprava:** teraz ho volá mazanie zariadenia v [DeviceView.vue](src/views/DeviceView.vue) (sekcia 4).
- [x] 🟡 L96 `getChartSensor($id_sensor, …)` – PHP-štýl názvu premennej.
  - **Oprava:** premenované na `id_sensor`.
- [x] 🟡 L9 `axios.defaults.withCredentials` sa nastavuje globálne zbytočne.
  - **Oprava:** riadok odstránený. `withCredentials: true` ostáva iba v `apiClient` s vysvetľujúcim komentárom (axios sa inde priamo nepoužíva).

### [FlashMessages](src/components/FlashMessages/FlashMessage.vue)
- [x] 🟠 L31-L39 – watcher spracuje pri jednom spustení iba jednu správu.
  - **Oprava:** watcher sleduje `flashMessages.length` a cez `splice(0)` presunie naraz **všetky** čakajúce správy. `immediate: true` zachytí aj správy pridané pred pripojením komponenty.
- [x] 🟠 L57 – tlačidlo zavrieť (`data-bs-dismiss`) nefunguje, lebo nie je načítaný Bootstrap JS.
  - **Oprava:** tlačidlo volá `@click="hide(m.id)"` a správu odstráni podľa jej `id`. Automatické skrytie po `timeout` používa ten istý `hide(id)`.
- [x] 🟠 L56 `v-html="m.message"` – riziko XSS.
  - **Oprava:** správa sa vypisuje ako text (`{{ m.message }}`). Overené, že žiadne volanie `showMessage` HTML nepoužíva.
- [x] 🟡 `:key="index"` pri `shift()`, `.fade-enter` (Vue 2), `<transition>` sa nikdy neprepne.
  - **Oprava:** každá správa dostane jedinečné `id` (počítadlo), ktoré slúži ako kľúč. Zoznam je `<TransitionGroup tag="ul" name="fade">` a CSS používa `.fade-enter-from`. Odstránené triedy `fade show` (bez Bootstrap JS by správu skryli). Kontajner má vynulovaný `margin` a `padding`.
- [x] 🟡 `getFirst` v [flash.js](src/components/FlashMessages/store/flash.js) sa nepoužíva.
  - **Oprava:** funkcia odstránená zo store.

---

## 2. Router / App

### [router/index.js](src/router/index.js)
- [x] 🟠 Chýba ochrana trás pre neprihláseného (`beforeEach` nič nerobí).
  - **Oprava:** trasy `/user/*`, `/devices`, `/device/*`, `/sensor/*`, `/views`, `/view/*` a `/chart/*` majú `meta: { requiresAuth: true }`. `beforeEach` pri takej trase počká na `store.ensureUser()` (dôležité pri prvom načítaní stránky). Neprihláseného presmeruje na `{ name: 'LogIn', query: { redirect } }` a LogInForm ho po prihlásení vráti späť. Voľné ostali `/`, `/units`, `/login` a `/logout`.
- [x] 🟡 L96 `props: route => ({ id: 0, … })` – nepoužitý parameter `route`.
  - **Oprava:** nahradené statickým objektom `props: { id: 0, mode: 'edit' }`.

### [App.vue](src/App.vue)
- [x] 🟡 L30-L43 – `<RouterLink>` vnútri `<BNavItem>` (`<a>` v `<a>`), prázdny `BNavItem` pre neprihláseného.
  - **Oprava:** `BNavItem` používa priamo prop `to` (bez vnoreného RouterLinku). Položka užívateľa má `v-if` na celom `BNavItem`. Odstránený nepoužitý import `RouterLink`.
- [x] 🟡 Dva protichodné mechanizmy tmavého režimu (color-modes.js na `<html>`, DarkModeButton na `<body>`, voľba sa nepamätá).
  - **Oprava:** jediný mechanizmus je [DarkModeButton.vue](src/components/DarkModeButton.vue). Nastavuje `data-bs-theme` na `<html>` a voľbu ukladá do `localStorage` (`theme`). Podľa času (18:00–6:00 tmavý) sa riadi iba vtedy, keď užívateľ ešte nič nezvolil. Téma sa aplikuje hneď pri vytvorení komponenty, aby stránka „neblikla“. Odstránené nepoužívané triedy `dark-mode`/`light-mode` na `<body>`. `v-b-color-mode="'dark'"` na navbare ostal zámerne (navbar je vždy tmavý).
- [x] 🟡 color-modes.js je mŕtvy kód z Bootstrap docs.
  - **Oprava:** súbor zmazaný a jeho import v `main.js` odstránený.
- [x] 🟡 nav-shrink.js sa nikde neimportuje.
  - **Oprava:** súbor zmazaný.

---

## 3. Prihlásenie / používateľ

### [LogInForm.vue](src/components/LogInForm.vue)
- [x] 🔴 L53-L65 – nekontroluje sa `response.data.status`, takže úspech sa hlási aj pri chybe.
  - **Oprava:** užívateľ sa uloží (`store.setUserData`) a zobrazí sa „Úspešne ste sa prihlásili“ iba pri `status == 200` s neprázdnym `user`. Inak sa pod formulárom zobrazí `response.data.message`.
- [x] 🟠 L66-L68 – pri chybe sa nič nezobrazí a tlačidlo ostane 60 s v stave „Prihlasujem…“.
  - **Oprava:** chyba siete zobrazí „Chyba spojenia alebo server neodpovedá.“. `loading` sa vypína vo `finally`. Odstránený 60-sekundový `setTimeout`.
- [x] 🟠 L48 `if (!email && !password)` – má byť `||`.
  - **Oprava:** zmenené na `||`. Navyše sa podľa backendu kontroluje minimálne 6 znakov hesla (predtým > 3).
- [x] 🟠 Odhlásenie nevynuluje `store.user_permission` ani menu zariadení.
  - **Oprava:** odhlásenie volá `store.setUserData(null)`. Tá vynuluje `user`, `token` aj `user_permission` a vyčistí menu zariadení. Pri chybe odhlásenia sa zobrazí hláška a vo `finally` nasleduje presmerovanie na `/`.
- [x] 🟡 `BForm v-model="form"` – `form` sa nepoužíva.
  - **Oprava:** `v-model` aj premenná `form` odstránené (aj zakomentované zvyšky).

### [LogInView.vue](src/views/LogInView.vue)
- [x] 🟠 Pri `/logout` rodič presmeruje na `/` ešte pred dokončením odhlásenia.
  - **Oprava:** pri `logOut` LogInView nič nepresmerúva. Presmeruje až LogInForm po dokončení odhlásenia. Počas odhlasovania sa zobrazí „Odhlasujem…“ namiesto formulára.
- [x] 🟡 Po prihlásení sa presmerúva dvakrát.
  - **Oprava:** odstránený `watch(store.user)`. Po prihlásení presmerúva iba LogInForm. LogInView v `onMounted` cez `ensureUser()` len presmeruje už prihláseného užívateľa, ktorý otvorí `/login`.
- [x] 🟡 L35 – nadpis je vždy „Prihlásenie“.
  - **Oprava:** nadpis je „Odhlásenie“ alebo „Prihlásenie“ podľa `props.logOut`.

### [PasswordChange.vue](src/components/user/PasswordChange.vue)
- [x] 🔴 L60 `alert('Heslo úspešne zmenené!')` sa zobrazí vždy.
  - **Oprava:** `alert` odstránený. O výsledku informuje iba flash správa podľa skutočného statusu.
- [x] 🔴 L53 `router.push('/user')` – trasa neexistuje.
  - **Oprava:** zmenené na `/user/user`.
- [x] 🟠 Pri `status != 200` žiadna hláška. `store.user = response.data.data` prepisuje užívateľa.
  - **Oprava:** pri chybe sa zobrazí flash s `response.data.message`. Backend pri zmene hesla užívateľa nevracia (`user: null`, `data` vôbec neexistuje), takže priradenie nastavilo `store.user` na `undefined` a užívateľ sa javil ako odhlásený. Store sa už nemení. Formulár sa vyčistí iba pri úspechu a tlačidlo je počas odosielania zablokované (`submitting`).

### [UserChange.vue](src/components/user/UserChange.vue)
- [x] 🟠 L32-L43 – pri `status != 200` žiadna hláška, odoslanie nie je blokované pri neplatnom e-maile.
  - **Oprava:** pri chybe sa zobrazí flash s `response.data.message`. Tlačidlo „Uložiť zmeny“ je zablokované pri neplatnom e-maile alebo počas odosielania a stav e-mailu sa vyhodnotí už pri načítaní. Backend vracia `user` (nie `data`), takže pôvodné `store.user = response.data.data` nastavilo užívateľa na `undefined`. Teraz sa použije `store.setUserData(response.data)`.

---

## 4. Zariadenia

### [DeviceView.vue](src/views/DeviceView.vue)
- [x] 🔴 L51 `if (device = null)` – priradenie namiesto porovnania, takže uloženie vždy skončí TypeError.
  - **Oprava:** `updateViewAfterEdit` prepísaná: zavolá `store.getDevices()`, zistí id (existujúce zariadenie alebo `device.id` z odpovede pri vytvorení) a presmeruje na `/device/<id>`.
- [x] 🔴 L142-L147 – modal na zmazanie obsahuje iba „Foobar?“, mazanie nie je implementované.
  - **Oprava:** modal s potvrdením (názov zariadenia, varovanie o vymazaní senzorov a dát) a tlačidlom „Odstrániť“, ktoré volá `MainService.postDeviceDelete`. Pri úspechu: flash, `resetActualDeviceId`, `getDevices` a presmerovanie na `/devices`. Pri chybe sa zobrazí flash. ⚠️ **Backend (`apimeteo`) zatiaľ nemá akciu `Devices:delete`**, takže mazanie skončí chybovou hláškou, kým ju tam nedoplníš.
- [x] 🟠 L61-L76 – tri watchery, viacnásobné načítanie a načítanie so zlým id pri odchode z trasy.
  - **Oprava:** jediný `watch(() => [props.id, props.edit], …, { immediate: true })`. Watcher na `route.params.id` a `onMounted` odstránené. `mode_edit` je `computed` odvodený z props, nie samostatný stav.
- [x] 🟠 Po vytvorení / úprave sa nevolá `store.getDevices()`, pri novom zariadení ostáva URL `/device/edit/0`.
  - **Oprava:** viď prvý bod: `getDevices()` a presmerovanie na detail nového alebo upraveného zariadenia.
- [x] 🟡 L134 `:to` na `<button>`.
  - **Oprava:** `:to` aj nadbytočné `role="button"` odstránené, doplnené `type="button"`. Relatívny odkaz `'edit/'+id` v nadpise je teraz absolútny `/device/edit/<id>`.

### [Device_edit.vue](src/components/Devices/Device_edit.vue)
- [x] 🟠 L34 – `length > 4` nesedí s popisom „4 – 15 znakov“.
  - **Oprava:** zmenené na `length >= 4 && length <= 15`.
- [x] 🟡 L29 regex `^[0-9A-Za-z]*$` prijme prázdny reťazec.
  - **Oprava:** zmenené na `^[0-9A-Za-z]+$`.
- [x] 🟡 Formulár sa naplní iba raz, zmena `defaultValues` sa neprejaví.
  - **Oprava:** DeviceView komponentu remountuje cez `:key="device_one?.id ?? 0"`, takže pri inom zariadení sa formulár vytvorí nanovo. Doplnený vysvetľujúci komentár.

### [DeviceOneOverview.vue](src/components/Devices/DeviceOneOverview.vue)
- [x] 🔴 L101 `'props.device/' + id` – rozbitý odkaz „Viac info“.
  - **Oprava:** zmenené na `'/device/' + props.device.id`.
- [x] 🔴 L84 `sen.last_out_value.toFixed(2)` padne pri `null`.
  - **Oprava:** nová funkcia `formatValue()` vráti `---` pre `null`, `undefined` a nečíselné hodnoty, inak číslo na 2 desatinné miesta.
- [x] 🔴 L71-L78 `Object.keys(props.device.sensors)` padne pri `sensors === null`.
  - **Oprava:** `computed` hodnoty `sensorList` (pri `null` prázdne pole) a `sensorCount`. Šablóna všade používa ich.
- [x] 🟠 L87, L93-L96 – napevno `device.id == 1` a senzory 19, 20, 16, pád ak senzor neexistuje.
  - **Oprava:** konštanty `SPEC_DEVICE_ID` a `SPEC_SENSOR = { temperature: 19, humidity: 20, windSpeed: 16 }` sú pomenované na jednom mieste. Funkcia `sensorValue(id)` bezpečne (`?.`) vráti číslo alebo `null`, takže pri chýbajúcom senzore DevicesSpec zobrazí „—“ namiesto pádu.
- [x] 🟡 `sen.sumdata` môže chýbať, potom `[...records]` padne.
  - **Oprava:** `export_data` pracuje len s poľom (inak prázdne dáta). Graf sa vykreslí iba pri neprázdnom poli `sumdata`.

### [DevicesSpec.vue](src/components/Devices/DevicesSpec.vue)
- [x] 🟡 Prop `sensors` sa posiela, ale nie je deklarovaný (warning „Extraneous non-props attributes“).
  - **Oprava:** DeviceOneOverview prop `sensors` už neposiela. Predvolené hodnoty props zmenené z vymyslených 20 °C / 50 % / 10 km/h na `null`, aby sa pri chýbajúcich dátach nezobrazil falošný výsledok.
- [x] 🟡 L64-L95 – `feelsLikeType` sa mení vnútri `computed`.
  - **Oprava:** jeden čistý `computed` `feelsLikeResult` vracia `{ value, type }` a `feelsLike` aj `feelsLikeType` sú z neho odvodené `computed`. Odstránený nepotrebný `ref`.
- [ ] 🟡 Skontrolovať jednotku rýchlosti vetra zo senzora 16 – vzorec očakáva km/h.
  - **Neopravené:** z kódu sa to overiť nedá, jednotka je len v dátach DB. Treba skontrolovať `value_unit` senzora 16. Ak meria m/s, hodnotu treba pred výpočtom vynásobiť 3,6.

### [DevicesView.vue](src/views/DevicesView.vue)
- [x] 🔴 L16 `v-if="!store.checkUserPermission('devices', 'add')"` – obrátená logika.
  - **Oprava:** odstránená negácia a opravený aj zdroj práva. ACL backendu používa názvy presenterov a akcií (`user_resource` = `Devices`). Vytvorenie zariadenia je akcia `edit` s id 0, takže kontrola je `checkUserPermission('Devices', 'edit')`. Relatívny odkaz `device/edit/0` je teraz absolútny `/device/edit/0`.
- [x] 🟡 Prop `edit` sa nepoužíva.
  - **Oprava:** `defineProps` odstránené.

### [SensorTab.vue](src/components/Devices/SensorTab.vue)
- [x] 🔴 L36 – funkcia `format_date` neexistuje.
  - **Oprava:** doplnená funkcia `format_date` (dayjs, formát `D.M.YYYY HH:mm:ss`, pri `null` vráti `---`), rovnaká ako v DevicesInfo.
- [x] 🔴 L35 – priorita operátorov pri výbere farby ikony.
  - **Oprava:** ternárny výraz je v zátvorkách: `'exclamation-triangle ' + (sensor.warningIcon == 1 ? 'text-danger' : 'text-warning')`.
- [x] 🟡 Hlavička má 6 stĺpcov, riadok 7. Triedy `pl-4 pr-1` sú z BS4.
  - **Oprava:** do hlavičky pridaný stĺpec „Akcie“ (`col-6 col-md-2`). `pl-4 pr-1` zmenené na `ps-4 pe-1`.

### [DeviceOtaUpdate.vue](src/components/Devices/DeviceOtaUpdate.vue)
- [x] 🟠 L37 `if (deleteId == 0)` porovnáva ref objekt.
  - **Oprava:** zmenené na `deleteId.value == 0`.
- [x] 🟠 L22-L25 – `submit()` vracia `true` aj pri chybe, takže modal sa zavrie.
  - **Oprava:** `DeviceSendUpdate.submit()` vracia `true` iba pri `status === 200`, takže pri chybe modal ostane otvorený a chyba sa zobrazí v ňom (viď nižšie).
- [x] 🟡 L39 zabudnutý `console.log`. Prázdne `updates: []` zobrazí iba hlavičku.
  - **Oprava:** `console.log` odstránený. Tabuľka sa zobrazí iba pri neprázdnych `updates` (`Object.keys(...).length`), inak „Aktualizácie ešte neexistujú“.

### [DeviceSendUpdate.vue](src/components/Devices/DeviceSendUpdate.vue)
- [x] 🟡 L66 `BFormFile` má `v-model` aj `@change`. Nekontroluje sa `.bin` ani `fromVersion`. Nesúvisiace `id`.
  - **Oprava:** odstránený `@change` a `handleFileChange`, ostal iba `v-model`. Pribudla validácia: `fromVersion` musí zodpovedať `^[0-9A-Za-z._-]+$` (podľa textu nápovedy) a súbor musí mať príponu `.bin` (aj `accept=".bin"`). Polia majú stav `is-valid`/`is-invalid` a chyby (validácia aj server) sa zobrazia v modale. `aria-describedby` a `id` nápovedy zjednotené na `fromVersionHelp`. „Files:“ preložené na „Súbor:“.

### [DeviceOneInfo.vue](src/components/Devices/DeviceOneInfo.vue)
- [x] 🟠 L190 `href="Device:blobs item.id"` – zvyšok z Latte.
  - **Oprava:** nefunkčný odkaz odstránený. Zobrazuje sa iba počet súborov a je doplnená TODO poznámka, že odkaz príde, keď bude existovať stránka alebo API pre súbory zariadenia.
- [x] 🟡 L135 preklep `'ne'`.
  - **Oprava:** zmenené na `'nie'`.

### [DeviceSendConfig.vue](src/components/Devices/DeviceSendConfig.vue)
- [x] 🟠 Nedokončené – „NEDOKONČENÉ …“ a Latte makro `{control sendconfigForm}`.
  - **Oprava:** nový formulár s textovým poľom pre zmenu konfigurácie. Kontroluje max. 256 byte na riadok a 512 byte celkom (počítané cez `TextEncoder`, teda skutočné byty UTF-8) a zobrazuje počítadlo aj zoznam príliš dlhých riadkov. Odosiela sa cez existujúce API `device/<id>/edit` s `{ name: name_no_prefix, config_data, config_ver: config_ver + 1 }`, rovnako ako pôvodný IoT-server (backend povoľuje polia `config_data` a `config_ver` v `EDIT_FIELDS`). Po úspechu sa modal v [DeviceOneInfo.vue](src/components/Devices/DeviceOneInfo.vue) zavrie (`no-footer`, `size="xl"`) a údaje zariadenia sa znova načítajú. *Pozn.: pôvodný server navyše mazal session zariadenia (vynútené nové prihlásenie). API to nerobí, takže zariadenie si zmenu stiahne pri najbližšom prihlásení.*

### [DevicesInfo.vue](src/components/Devices/DevicesInfo.vue), [DevicesOverview.vue](src/components/Devices/DevicesOverview.vue)
- [x] 🟡 `<template v-if="…">` na koreňovom `<template>` SFC sa ignoruje.
  - **Oprava:** `v-if` z koreňového `<template>` odstránený. Pri `null` nič nevykreslí `v-for`.

---

## 5. Senzory

### [SensorView.vue](src/views/SensorView.vue)
- [x] 🟠 L61-L64 – watcher na `route.params.id` sa spustí aj pri odchode zo stránky (načíta senzor s ID zariadenia), plus dvojité načítanie.
  - **Oprava:** odstránený watcher na `route.params.id` aj `onMounted`. Ostal jediný `watch(() => props.id, …, { immediate: true })`. Id prichádza iba z props routera, takže pri odchode na inú trasu sa nič nenačíta. Pri neplatnom id sa nastaví chybová hláška. Chyba z predchádzajúceho načítania sa pri novom načítaní vynuluje.
- [x] 🟡 Prop `edit` sa nepoužíva.
  - **Oprava:** prop odstránený (aj nepoužitý `useRoute`).

### [SensorEdit.vue](src/components/Sensor/SensorEdit.vue)
- [x] 🟠 L35 – emituje sa `"delete"`, ale v `defineEmits` chýba.
  - **Oprava:** `defineEmits(["save", "cancel", "delete"])`.
- [x] 🟠 Checkboxy `preprocess_data`, `warn_max`, `warn_min` odosielajú `true/false` namiesto `0/1`.
  - **Oprava:** checkboxy majú `:true-value="1" :false-value="0"`, takže API dostane rovnaký formát, aký posiela (backend ukladá hodnoty priamo do DB).
- [x] 🟡 L187 `:checked` popri `v-model`. Hlášky pri chybe mazania hovoria „Pri ukladaní…“.
  - **Oprava:** `:checked` odstránený. Hlášky pri mazaní sú vlastné („Chybné ID senzora…“, „Senzor sa nepodarilo vymazať: <správa servera>“, „Pri mazaní senzora došlo k chybe…“).
- [x] 🟡 SensorEdit používa `id_sensor_classes`, SensorInfo a SensorStat `device_class`.
  - **Oprava:** v DB bol stĺpec `device_class` premenovaný na `id_sensor_classes` (`apimeteo/sql/change.sql:154`), takže SensorInfo a SensorStat čítali neexistujúce pole (typ senzora sa nezobrazoval a mesačná tabuľka sa vždy brala ako ne-impulzná). Obe komponenty prepnuté na `id_sensor_classes`.

### [SensorInfo.vue](src/components/Sensor/SensorInfo.vue)
- [x] 🟠 L9-L21 + `v-html` – texty varovaní zadané užívateľom sa vkladajú bez escapovania (stored XSS).
  - **Oprava:** `computed` s HTML reťazcami a `v-html` odstránené. Text varovania sa skladá priamo v šablóne a hodnoty (aj `warn_max_text` a `warn_min_text`) sa vypisujú cez `{{ }}`, takže sú escapované. Pomocné `computed` `warnMax` a `warnMin` iba rozhodujú, či sa varovanie zobrazí.
- [x] 🟡 Preklep v názve `sensorWarnMim`.
  - **Oprava:** `computed` odstránený (viď predchádzajúci bod), takže preklep zanikol.

### [SensorStat.vue](src/components/Sensor/SensorStat.vue)
- [x] 🟠 L38, L43, L173 – čítanie `props.sensor.id`, keď je `props.sensor` `null`.
  - **Oprava:** `watch` + `onMounted` nahradil jeden `watch(() => props.sensor?.id, …, { immediate: true })`. Blok s tlačidlom „Späť“ má `v-if="props.sensor != null"`.
- [x] 🟡 L183 `sensorStats.years.slice(-1)` padne, ak `years` chýba. Poradie rokov?
  - **Oprava:** nový `computed` `oldestYear` bezpečne vráti posledný prvok alebo `null` a riadok sa zobrazí iba ak existuje. Poradie overené v backende: `ChartParameters::getAltYearsList()` vracia roky zostupne, takže posledný je najstarší.
- [x] 🟡 Triedy `text-right`, `thead-light` sú z BS4.
  - **Oprava:** nahradené `text-end` a `table-light`.

### SensorChart.vue (zmazaný)
- [x] 🟠 Celý súbor je nekonvertovaná Latte šablóna, nikde sa neimportuje.
  - **Oprava:** súbor zmazaný. Graf senzora zobrazuje [ChartView.vue](src/views/ChartView.vue).

---

## 6. Grafy

### [ChartView.vue](src/views/ChartView.vue) + [ChartHeader.vue](src/components/Chart/ChartHeader.vue)
- [x] 🔴 Zmena dátumu alebo dĺžky v ChartHeader neaktualizuje graf (ChartView nepočúva `update:dateFrom` / `update:lenDays`).
  - **Oprava:** ChartHeader má jedinú udalosť `update:params` s kompletným `{ dateFrom, lenDays, altYear }`. Posiela ju jeden watcher pri **akejkoľvek** zmene formulára (tlačidlá, input dátumu, select dĺžky aj roku). ChartView ju spracuje v `updateParams`.
- [x] 🟠 L43-L62 – request sa pošle pred aplikovaním `route.query`, pri zmene `id` sa dáta nenačítajú znova.
  - **Oprava:** `chartParams` sa inicializujú z `route.query` hneď pri vytvorení (validácia dátumu, pri dátume s časom sa vezme len dátum; `altYear` "null" alebo nečíselný sa zmení na `null`). Údaje o senzore a roky načíta `watch(() => props.id, …, { immediate: true })`. Zmeny parametrov sa zapisujú späť do URL (`router.replace`), takže stránku ide obnoviť alebo zdieľať.
- [x] 🟠 L88-L95 – odkazy „Späť“ vedú pred načítaním na `/device/null`.
  - **Oprava:** `computed` `backDeviceId` a `backSensorId` berú id prednostne z načítaného senzora, potom zo store (senzor ešte z `props.id`). Odkaz sa zobrazí iba ak id existuje.
- [x] 🟠 ChartHeader L119-L131 – „± rok“ pri porovnávacom roku nič nespraví, kým nie je rok zvolený.
  - **Oprava:** keď rok nie je zvolený, posun začne od roku zobrazeného obdobia (`dayjs(form.dateFrom).year()`).
- [x] 🟡 `new Date().toISOString().split('T')[0]` vracia dátum v UTC.
  - **Oprava:** všetky dátumy počíta lokálne dayjs (`today()`, `addDays()` cez `dayjs().add()`, `startOf('year')`), vrátane `:max` pri inpute dátumu.
- [x] 🟡 L54-L63 – watcher `altYear` mení `form.altYear` sám v sebe (dvojitý emit), `update:altYear` posiela celý `form`.
  - **Oprava:** samostatné watchery odstránené. Hodnota `''` alebo `null` sa na `null` prevádza iba v emitovanom objekte (formulár sa vo watchi nemení). Select roku používa `v-model.number`, prázdnu voľbu `:value="null"` a číselné hodnoty.
- [x] 🟡 L26, L46 zabudnuté `console.log`. Trieda `align-center` neexistuje.
  - **Oprava:** `console.log` odstránené (aj zakomentovaný príklad Chart.js a nepoužívané `current/minus/plus`). `align-center` nahradené `text-center`. Alt obrázka zmenený z „Placeholder Chart“ na „Graf senzora“.

---

## 7. Pohľady (Moje grafy)

### [ViewsView.vue](src/views/ViewsView.vue)
- [x] 🟠 L81 – počas načítania sa zobrazí spinner aj hláška „Zatiaľ neexistujú žiadne grafy“.
  - **Oprava:** hláška má podmienku `views != null && viewsCount == 0 && mode === 'view'`, takže sa zobrazí až po načítaní.
- [x] 🟠 L81 `views.views.length` – pri objekte je `undefined`.
  - **Oprava:** podľa backendu (`Views::readViews`) je `views.views` objekt kľúčovaný id grafu. Nový `computed` `viewsCount` používa `Object.keys(...).length`.
- [x] 🟠 L76 vs. ViewsSimpleList – miešajú sa `view.id_view` a `view.id`.
  - **Oprava:** backend vracia iba `id` (`id_view` je stĺpec v `view_detail`, nie v pohľade). Kľúče vo [ViewsSimpleList.vue](src/components/Views/ViewsSimpleList.vue) a [ViewsDetailList.vue](src/components/Views/ViewsDetailList.vue) sú `view.id`. Editovaný graf vyberá `computed` `editedView`. Ak graf s daným id neexistuje, zobrazí sa chyba namiesto prázdneho formulára.
- [x] 🟡 L91-L95 – `<style>` bez `scoped`.
  - **Oprava:** zmenené na `<style scoped>`.

### [ViewEditForm.vue](src/components/Views/ViewEditForm.vue)
- [x] 🔴 L390 – „Zruš“ má `type="submit"`, takže formulár uloží.
  - **Oprava:** tlačidlo „Zrušiť“ má `type="button"` a emituje `cancel`. ViewsView na to reaguje `router.push('/views')`.
- [x] 🟠 L200-L208 – pri chybe sa emituje `updateView` a údaje sa stratia.
  - **Oprava:** pri chybe sa nič neemituje a chyba sa zobrazí nad tlačidlami. `updateView` sa emituje iba pri úspechu. `submitting` sa vypína vo `finally` (predtým ostal navždy `true`).
- [x] 🟠 L139-L147 `validateVorder` nekontroluje `> 0`.
  - **Oprava:** kontroluje sa celé číslo `>= 1`. Pole má `@blur` validáciu, triedu `is-valid`/`is-invalid` a viditeľnú chybovú hlášku.
- [x] 🟡 L150 `console.log`, nepoužitý prop `csrfToken`, nepoužitá trieda `.error`.
  - **Oprava:** všetko odstránené, aj nepoužívaná funkcia `clearErrors`. Načítanie údajov do formulára je zjednotené vo funkcii `fillForm()` (predtým duplicitne v `onMounted` a vo watchi). `allow_compare` sa prevádza na boolean (`== 1`) a odosiela ako `1/0`.
- [x] 🟡 České slová v slovenskom UI.
  - **Oprava:** „Ukladám…“, „Uložiť“, „Zrušiť“, „Zvoľte“, „Zadajte“, „Len písmená“, „možnosť“.

### [ViewsDetailList.vue](src/components/Views/ViewsDetailList.vue)
- [x] 🟠 L60, L64, L71, L76 – `views.sensors[sid]` a `item.colors[1|2]` padnú pri chýbajúcom senzore alebo farbe.
  - **Oprava:** pomocné funkcie `sensorById()` a `sensorLabel()`. Pri neznámom senzore sa zobrazí „(neznámy senzor #id)“ a jednotka sa vynechá. `getColor()` pre chýbajúcu farbu vráti `transparent` a v šablóne je `item.colors?.[n]`.
- [x] 🟡 Atribúty `density`, `theme` z Vuetify. Stĺpec „Akcia“ nemá odkaz na editáciu.
  - **Oprava:** atribúty odstránené (aj v ViewsSimpleList). Do stĺpca „Akcia“ doplnené tlačidlo „Upraviť“ (`/view/edit/<id>`) ako v SimpleList.

---

## 8. Ostatné

- [x] 🟠 MySettings.vue L42-L49 – `getDevices()` sa pri štarte volá dvakrát a staršia (verejná) odpoveď môže prepísať dáta prihláseného.
  - **Oprava:** MySettings.vue zmazaný (mal prázdny `<template>`, na čo upozorňoval ESLint) a jeho logika je v [App.vue](src/App.vue). Zariadenia načítava jediný `watch(() => [store.user_loaded, store.user?.id])`: raz po zistení, kto je prihlásený, a potom pri každom prihlásení alebo odhlásení (uloženie profilu s rovnakým id nič nenačíta). `store.getDevices()` navyše čísluje požiadavky a ignoruje zastarané odpovede.
- [x] 🟡 [MainMenuItem.vue](src/components/MainMenu/MainMenuItem.vue) L43-L44 – `viewSubmenu` vracia `true` pre každú položku, takže sa vykreslia prázdne `<ul>`.
  - **Oprava:** na začiatku `if (props.children == null) return false`, takže podmenu sa vykreslí iba pri položkách s deťmi. Odstránený nepoužívaný `isActiveLink`.
- [x] 🟡 [UnitsShow.vue](src/components/UnitsShow.vue) – modal má nadpis „Úprava jednotky“ aj pri pridávaní. Pri chybnom `status` v `getUnits` nič.
  - **Oprava:** nadpis aj popisky polí závisia od `active_unit_id` („Pridanie jednotky“ / „Úprava jednotky“). Upozornenie o zmene názvu vo všetkých senzoroch sa zobrazí iba pri úprave. Pri `status != 200` v `getUnits` sa zobrazí flash s chybou.
- [x] 🟡 [HomeView.vue](src/views/HomeView.vue) L15 – pre neprihláseného chýba `row`.
  - **Oprava:** pre neprihláseného sa použije `row row-cols-1 g-4`.
- [x] 🟡 [UserOverview.vue](src/components/Homepage/UserOverview.vue) – nepoužité štýly `.table`.
  - **Oprava:** celý blok `<style>` odstránený.
