import { Locator, Page , expect } from "@playwright/test";

export class Navigation {
    readonly page:Page

    mojPulpitButton: Locator
    mojPulpitSzybkiPzelewButton: Locator
    mojPulpitDoladowanieTelefonuButton: Locator
    mojPulpitManagerFinansowyButton: Locator
    managerFinansiwyButton: Locator
    kontaOsobisteButton: Locator
    platnosciButton: Locator
    raportyButton: Locator
    generujPrzelewButton: Locator
    wykresyButton: Locator
    tabeleDanychButton: Locator
    ustawieniaButton: Locator
    subPageHeared: Locator


    constructor (page:Page) {
        this.page = page;
        this.mojPulpitButton = page.locator('#pulpit_btn')
        this.mojPulpitSzybkiPzelewButton = page.locator('#quick_btn')
        this.mojPulpitDoladowanieTelefonuButton = page.locator('.i-phone')
        this.managerFinansiwyButton = page.locator('.i-nav-savings#manager_fin_btn')
        this.kontaOsobisteButton = page.locator('#privaccounts_btn')
        this.platnosciButton = page.locator('#payments_btn')
        this.raportyButton = page.locator('#reports_btn')
        this.generujPrzelewButton = page.locator('#user_reports_btn')
        this.wykresyButton = page.locator('#charts_btn')
        this.tabeleDanychButton = page.locator('#tables_btn')
        this.ustawieniaButton = page.locator('.i-nav-settings')
        this.subPageHeared = page.locator('h1.wborder').first()
    }

    async mojPulpitPage () {
        await this.mojPulpitButton.click();
    }

    async mojPulpitSzybkiPzelewPage () {
        await this.mojPulpitSzybkiPzelewButton.click();
    }

    async mojPulpitDoladowanieTelefonuPage () {
        await this.mojPulpitDoladowanieTelefonuButton.click();

    }

    async mojPulpitManagerFinansowyPage () {
        await this.managerFinansiwyButton.click();
    }

    async kontaOsobistePage () {
        await this.kontaOsobisteButton.click();        
    }

    async platnosciPage () {
        await this.platnosciButton.click();
    }

    async raportyPage () {
        await this.raportyButton.click();
    }

    async generujPrzelewPage () {
        await this.generujPrzelewButton.click();
    }

    async wykresyPage () {
        await this.wykresyButton.click();
    }

    async tabeleDanychPage () {
        await this.tabeleDanychButton.click();
    }

    async ustawieniaPage () {
        await this.ustawieniaButton.click();
    }

    async checkHeaderText (headerText: string) {
        await expect(this.subPageHeared).toHaveText(headerText)
    }
}