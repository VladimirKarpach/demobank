import {test as base} from '@playwright/test'
import { LoginPage } from './pages/loginPage';
import { Navigation } from './pages/bankPage';
import { MojPuplitPage } from './pages/mojPolpitPage';
import { GenerateTransferPage } from './pages/generateTransferPage';

export type Fixtures = {
    setup: string
    signIn: string
    navigateToTransferGenerationPage: string
    navigateToQuickTransfePage: string
    onLoginPage: LoginPage
    onMojPulpitPage: MojPuplitPage
    navigateTo: Navigation
    onGenerateTransferPage: GenerateTransferPage

}

export const test = base.extend<Fixtures>({
    onLoginPage: async({page}, use) => {
        const onLoginPage = new LoginPage(page);
        await use(onLoginPage);
    },

    onMojPulpitPage: async({page}, use) => {
        const onMojPulpitPage = new MojPuplitPage(page);
        await use(onMojPulpitPage);
    },

    navigateTo: async({page}, use) => {
        const navigateTo = new Navigation(page);
        await use(navigateTo);
    },

    onGenerateTransferPage: async({page}, use) => {
        const onGenerateTransferPage = new GenerateTransferPage(page);
        await use(onGenerateTransferPage);
    },

    setup: [async({page}, use) => {
        await page.goto('https://demo-bank.vercel.app/');
        await use('');
    },{auto: true}],

    signIn: async({page, onLoginPage}, use) => {
        await onLoginPage.idInputField.fill('TestUser');
        await onLoginPage.passwordInputField.fill('TestPass');
        await page.getByRole('button').click();
        await use('');
    },

    navigateToTransferGenerationPage: async({page, signIn, navigateTo}, use) => {
        await navigateTo.generujPrzelewPage();
        await use('');
    },

    navigateToQuickTransfePage: async({page, signIn, navigateTo}, use) => {
        await navigateTo.mojPulpitSzybkiPzelewPage();
        await use('');
    }
})