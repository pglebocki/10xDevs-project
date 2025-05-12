# Aplikacja - Strona Web do przeglądania raportów aktywności developerów na repozytorium Github (MVP)

## Główny problem
Wgląd w rózne metryki (rozszerzające mozliwości Github Insight) dotyczące aktywności deweloperów na repozyroriach Github czyli np. udział w CodeReview, kontrybucja w commity

## Najmniejszy zestaw funkcjonalności
- Lista kilku repozytorium do wyboru
- Wybór developera (na zaznaczonym repo)
- wizualizacja przy pomocy diagramu graficznego osi czasu przedstawiającej PullRequesty stworzone przez wybranego dewelopera
- kazdy pull request wyswietlony jest jak pasek na osi czasu, ma początek i koniec (lub jest otwarty)
- PR wyróznia sie kolorem, osobne kolory na PR: otwary, zmergowany, anulowany
- na kazdym pull requescie widoczne są punkty czas pokazujące akcje uzytkowników takie jak commity do PR, dodawane komentarze, approvale

## Co NIE wchodzi w zakres MVP
- zaawansowane metryki
- dynamiczne zarządzenie listą repozytoriów
- zapysywania preferencji

## Kryteria sukcesu
Chciałbym móc ocenić ile czasu zajmuje deweloperowi zebranie approvali do PR, wprowadzenie poprawek, adresacja idzielonego feedbacku i zmergowanie PR.