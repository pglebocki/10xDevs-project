# Dokument wymagań produktu (PRD) - Dashboard aktywności deweloperskiej na GitHub
## 1. Przegląd produktu
Dashboard aktywności deweloperskiej na GitHub to aplikacja webowa umożliwiająca przegląd raportów aktywności deweloperów na repozytoriach GitHub. Aplikacja oferuje wizualizację historii Pull Requestów w formie poziomej osi czasu, gdzie każdy PR jest reprezentowany jako pasek o określonym statusie (otwarty, zmergowany, anulowany). System integruje się z GitHub REST API przy użyciu tokena oraz wykorzystuje mechanizmy cachowania i automatycznego odświeżania, aby zapewnić szybki dostęp do danych. Lista repozytoriów jest statyczna i zahardcodowana, a interfejs umożliwia wybór dewelopera i wyświetlanie szczegółowych informacji po najechaniu kursorem.

## 2. Problem użytkownika
Użytkownicy, tacy jak menedżerowie i liderzy zespołów, potrzebują narzędzia umożliwiającego szybkie i przejrzyste monitorowanie aktywności deweloperów. Kluczowym problemem jest ocena, ile czasu zajmuje deweloperowi zebranie approvali, wprowadzenie poprawek, adresacja przekazanego feedbacku oraz zmergowanie Pull Requesta. Brak takiego narzędzia utrudnia identyfikację wąskich gardeł w procesie przeglądu kodu i wpływa na efektywność zespołu.

## 3. Wymagania funkcjonalne
1. Lista statycznych repozytoriów - system powinien wyświetlać listę repozytoriów wraz z nazwą i URL.
2. Wybór dewelopera - użytkownik powinien móc wybrać dewelopera z listy przypisanej do danego repozytorium.
3. Serwis musi mieć mozliwość wyswietlanie roznych metryk. Na MVP wystarczy 1 metryka tj. wizualizacja pull requestów, ale musi być mozliwosc zmiany widoku w UI na inną metrykę.
3. Oś czasu - wizualizacja Pull Requestów jako poziome paski z oznaczeniem statusu:
   - Otwarte
   - Zmergowane
   - Anulowane
4. Szczegóły PR - po najechaniu kursorem na element osi czasu, powinna pojawiać się informacja o:
   - Użytkowniku, który wykonał akcję
   - Identyfikatorze komentarza lub approval
5. Integracja z GitHub REST API - pobieranie danych dotyczących Pull Requestów i powiązanych zdarzeń (commity, komentarze, approvale) przy użyciu tokena.
6. Mechanizm cachowania - backend powinien cachować pobrane dane oraz automatycznie odświeżać informacje w określonych interwałach.
7. Interfejs użytkownika:
   - Wyświetlanie progress baru podczas pobierania danych.
   - Obsługa błędów z wyświetleniem czytelnych komunikatów.
8. Podstawowy system uwierzytelniania i kont użytkowników:
   - Rejestracja i logowanie.

## 4. Granice produktu
1. MVP nie obejmuje zaawansowanych metryk analitycznych.
2. Lista repozytoriów jest statyczna i nie można jej dodawać lub modyfikować przez użytkownika.
3. Interakcje ograniczają się do wyboru dewelopera, przeglądania osi czasu oraz wyświetlania szczegółów PR przy najechaniu kursorem.
4. Brak możliwości modyfikacji danych - aplikacja pełni funkcję tylko do przeglądu.
5. Uwierzytelnianie obejmuje jedynie podstawowy system logowania, bez zaawansowanej kontroli dostępu.

## 5. Historyjki użytkowników

ID: US-001
Tytuł: Wybór repozytorium
Opis: Jako użytkownik chcę zobaczyć statyczną listę repozytoriów, aby wybrać źródło danych do analizy aktywności.
Kryteria akceptacji:
  - Lista repozytoriów zawiera nazwę i URL.
  - Repozytoria są wyświetlane w czytelnej formie.
  - Wybór repozytorium aktualizuje dostępne dane dla kolejnych operacji.

ID: US-002
Tytuł: Wybór dewelopera
Opis: Jako użytkownik chcę wybrać dewelopera powiązanego z wybranym repozytorium, aby móc zobaczyć jego aktywność.
Kryteria akceptacji:
  - System wyświetla listę deweloperów po wybraniu repozytorium.
  - Wybór dewelopera powoduje aktualizację osi czasu z PR.
  - Lista deweloperów jest czytelna i intuicyjna.

ID: US-003
Tytuł: Wybór widoku metryki
Opis: Jako użytkownik chcę mieć mozliwosć przełączania się pomiedzy roznymi metrykami. 
Kryteria akceptacji:
  - Dla MVP wystarczy 1 metryka (Os czasu PR)
  - Istnieje przełącznik w UI do wybory innych metryk
  - 2 metryka powinna zostaca dodana jako pusta strona

ID: US-004
Tytuł: Wizualizacja osi czasu
Opis: Jako użytkownik chcę widzieć interaktywną oś czasu, gdzie Pull Requesty są prezentowane jako dynamiczne wykresy tworzone przy użyciu biblioteki Chart.js, aby szybko ocenić historię aktywności dewelopera.
Kryteria akceptacji:
  - Oś czasu prezentuje PR jako dynamiczne wykresy generowane przy użyciu Chart.js.
  - Każdy pasek reprezentuje PR i posiada wyraźne oznaczenie statusu (otwarty, zmergowany, anulowany).
  - Po najechaniu kursorem na wykres, wyświetla się tooltip z dodatkowymi informacjami o PR.
  - Aktualny punkt na osi jest wyróżniony.
  - Oś zawiera oznaczenia czasowe dla ważnych zdarzeń.

ID: US-005
Tytuł: Wyświetlanie szczegółów PR
Opis: Jako użytkownik chcę, aby po najechaniu kursorem na element osi czasu, wyświetlane były dodatkowe informacje o danym PR, takie jak użytkownik, identyfikator komentarza lub approval.
Kryteria akceptacji:
  - Po najechaniu kursorem pojawia się tooltip z dodatkowymi informacjami.
  - Informacje w tooltipie obejmują dane o użytkowniku oraz identyfikatory komentarzy/approval.
  - Tooltip nie zakłóca funkcjonalności interfejsu.

ID: US-006
Tytuł: Integracja z GitHub REST API i mechanizm cachowania
Opis: Jako użytkownik chcę, aby system pobierał dane z GitHub REST API i cachował je, aby zapewnić szybki dostęp i aktualność informacji.
Kryteria akceptacji:
  - Aplikacja pobiera dane z GitHub REST API przy użyciu poprawnego tokena.
  - Dane są cachowane w backendzie.
  - Automatyczne odświeżanie danych odbywa się według ustalonego interwału.
  - W przypadku błędu pobierania danych wyświetlany jest komunikat o błędzie.

ID: US-007
Tytuł: Obsługa stanu ładowania i błędów
Opis: Jako użytkownik chcę widzieć wskaźnik ładowania oraz odpowiednie komunikaty o błędach, aby być świadomym stanu systemu podczas pobierania danych.
Kryteria akceptacji:
  - Podczas pobierania danych wyświetlany jest progress bar.
  - W przypadku błędu system prezentuje czytelny komunikat o problemie.
  - Użytkownik jest informowany o statusie operacji w czasie rzeczywistym.

## 6. Metryki sukcesu
1. Dokładność wizualizacji osi czasu – prawidłowe wyświetlanie statusów PR i oznaczeń czasowych.
2. Średni czas zebrania approvali, wprowadzenia poprawek, adresacji feedbacku oraz zmergowania PR.
3. Wskaźnik błędów podczas pobierania danych – liczba nieudanych zapytań do GitHub API powinna być minimalna.
4. Poziom satysfakcji użytkowników – pozytywny feedback dotyczący użyteczności interfejsu.
5. Szybkość odświeżania danych – automatyczne odświeżanie odbywa się w ustalonych interwałach bez zauważalnych opóźnień. 