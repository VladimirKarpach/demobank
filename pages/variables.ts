export class Variables {

    loginPage = {
        correctUserId: 'TestUser',
        correctPassword: 'TestPass',
        incorrectUserId: 'Test123',
        incorrectPassword: 'Pass123',
        idTooltipText: 'Wprowadź identyfikator otrzymany z banku lub alias - dodatkowy własny identyfikator, samodzielnie zdefiniowany w Demobank online.',
        passwordTooltipText: 'Wprowadź swoje hasło. Sprawdź, czy przycisk Caps Lock jest włączony. Uwaga: 3-krotne wprowadzenie błędnego hasła spowoduje zablokowanie dostępu do systemu.'
    }
    
    szybkiPrzelewPage = {
        tooltipText: 'widżet umożliwia zlecenie przelewu zwykłego do jednego ze zdefiniowanych odbiorców',
        dropdownOptions: ['wybierz odbiorcę przelewu', 'Jan Demobankowy', 'Chuck Demobankowy', 'Michael Scott']
    }

    doladoawaniaPage = {
        dropboxOptions: ['wybierz telefon do doładowania', '500 xxx xxx', '502 xxx xxx', '503 xxx xxx', '504 xxx xxx'],
        telephoneNumbersWithoutDefaultTopUpValue: ['500 xxx xxx', '502 xxx xxx', '503 xxx xxx'],
        telephoneNumbersWithDefaultTopUpValue: ['504 xxx xxx'],
        doladowanieTelefonuTopUpInfoTooltipText150: 'Informacje o doładowaniu: Minimalna kwota doładowania to: 5 zł Maksymalna kwota doładowania to: 150 zł',
        doladowanieTelefonuTopUpInfoTooltipText500: 'Informacje o doładowaniu: Minimalna kwota doładowania to: 5 zł Maksymalna kwota doładowania to: 500 zł',
        amountTooLowErrorMessage: 'kwota musi być większa lub równa 5',
        amountTooHighErrorMessag500: 'kwota musi być mniejsza lub równa 500',
        amountTooHighErrorMessag150: 'kwota musi być mniejsza lub równa 150',
        amoutDropdownValues: ['5', '10', '25', '40', '50', '100', '200']
        
    }

    constructor () {
        
    }
}