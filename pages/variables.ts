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
        TooltipText: 'widżet umożliwia zlecenie przelewu zwykłego do jednego ze zdefiniowanych odbiorców',
        DropdownOptions: ['wybierz odbiorcę przelewu', 'Jan Demobankowy', 'Chuck Demobankowy', 'Michael Scott']
    }

    doladoawaniaPage = {
        DropboxOptions: ['wybierz telefon do doładowania', '500 xxx xxx', '502 xxx xxx', '503 xxx xxx', '504 xxx xxx'],
    }

    constructor () {
        // this.loginPage = loginPage
        // this.szybkiPrzelewPage = szybkiPrzelewPage
        // this.doladoawaniaPage = doladoawaniaPage

    }
}